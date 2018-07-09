import * as VList from 'vuetify/es5/components/VList';
import VMenu from 'vuetify/es5/components/VMenu';
import * as VToolbar from 'vuetify/es5/components/VToolbar';
import VDivider from 'vuetify/es5/components/VDivider';
import Toast from '@/components/Toast';

// @vue/component
export default {
  name: 'Card',
  components: {
    ...VList,
    ...VToolbar,
    VDivider,
    VMenu,
  },
  directives: {
    init: {
      isLiteral: true,
      bind: (el, { value, modifiers }, { context, componentInstance }) => {
        const data = modifiers.settings
          ? context.$store.state.cardsSettings.cards[value]
          : context.$store.state.cache.cards[value];
        if (!data) return;
        if (!modifiers.settings) {
          const { CACHE_DT } = data;
          if (CACHE_DT) {
            // Default cache timeout is 60s
            const cacheValidity = (Cards.cards[value].cacheValidity || 60) * 1000;
            /* eslint-disable-next-line no-param-reassign */
            componentInstance.VALID_CACHE = Date.now() < CACHE_DT + cacheValidity;
          }
        }
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i += 1) {
          if (componentInstance.$data[keys[i]] !== undefined) {
            /* eslint-disable-next-line no-param-reassign */
            componentInstance.$data[keys[i]] = data[keys[i]];
          }
        }
      },
      unbind: (el, { modifiers }, { context, componentInstance }) => {
        if (modifiers.settings && context && context.$data.pendingSave && context.saveSettings) {
          context.saveSettings(componentInstance.$data);
        }
      },
    },
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      title: null,
      subTitle: null,
      cmp: {
        card: null,
        settings: null,
      },
      showSettings: false,
      pendingSave: false,
      loaded: false,
      error: null,
      hash: '',
      actions: [],
    };
  },
  computed: {
    theme() {
      if (this.options.theme && !this.showSettings) {
        return this.options.theme;
      }
      return null;
    },
    options() {
      return Cards.cards[this.id];
    },
    lightPrimary() {
      return this.$store.state.settings.theme.light;
    },
    debug() {
      return this.$store.state.settings.debug;
    },
    settings() {
      if (!this.cmp.settings || this.hash == null) return {};
      const data = this.cmp.settings.data();
      const tmp = this.$store.state.cardsSettings.cards[this.id];
      if (!tmp) return data;
      const keys = Object.keys(data);
      for (let i = 0; i < keys.length; i += 1) {
        if (typeof data[keys[i]] === typeof tmp[keys[i]]) {
          data[keys[i]] = tmp[keys[i]];
        }
      }
      return data;
    },
  },
  created() {
    const { id } = this;
    const { cmp, permissions, origins } = Cards.cards[id];
    this.cmp.card = () => import(/* webpackMode: "eager" */`@/cards/${cmp}`)
      .then((tmp) => {
        if (tmp.default.title) this.title = tmp.default.title;
        if (!permissions && !origins) return tmp.default;
        return this.$utils.permissions.allowed({
          permissions: permissions || [],
          origins: origins || [],
        }).then((res) => {
          if (!res) {
            Toast.show({
              title: `${id} needs new permissions that it cannot have, retry later.`,
              color: 'error',
              timeout: 10000,
              dismissible: false,
            });
            return null;
          }
          return tmp.default;
        });
      })
      .then((tmp) => {
        const settingsName = Cards.settings[id];
        if (!settingsName) return tmp;
        return import(`@/cards/${settingsName}`)
          .then((data) => {
            this.cmp.settings = data.default;
            return tmp;
          });
      });
  },
  methods: {
    remove() {
      if (this.options.permissions || this.options.origins) {
        this.$utils.permissions.remove({
          permissions: this.options.permissions || [],
          origins: this.options.origins || [],
        });
      }
      this.$ga.event('cards', 'delete', this.id, 0);
      this.$store.commit('DEL_CARD_SETTINGS', this.id);
      this.$store.commit('DEL_CARD_CACHE', this.id);
      this.$store.commit('DEL_CARD', this.id);
      this.$emit('deleted');
    },
    init(data) {
      this.loaded = true;
      if (data === undefined && this.$store.state.cache.cards[this.id] !== undefined) {
        this.$store.commit('DEL_CARD_CACHE', this.id);
        return;
      }
      if (data instanceof Error) {
        this.error = `${this.id} got a loading error,`;
        Toast.show({
          title: `${this.error} please try again later.`,
          desc: this.$store.state.settings.debug ? data.message : null,
          color: 'error',
          timeout: 10000,
          dismissible: false,
        });
        return;
      }
      if (typeof data === 'object') {
        this.$store.commit('SET_CARD_CACHE', { key: this.id, data });
      }
    },
    reload() {
      this.loaded = false;
      this.error = null;
      this.$store.commit('DEL_CARD_CACHE', this.id);
      this.hash = Date.now().toString();
    },
    resetSettings() {
      this.$store.commit('DEL_CARD_SETTINGS', this.id);
      this.hash = Date.now().toString();
    },
    closeSettings(willSave) {
      this.pendingSave = willSave;
      this.showSettings = false;
    },
    saveSettings(data) {
      this.$store.commit('SET_CARD_SETTINGS', { key: this.id, data });
      this.reload();
      this.pendingSave = false;
    },
  },
};
