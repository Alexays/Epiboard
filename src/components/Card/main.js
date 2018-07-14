import * as VList from 'vuetify/es5/components/VList';
import * as VToolbar from 'vuetify/es5/components/VToolbar';
import { VMenu, VDivider } from 'vuetify';
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
        /* eslint-disable no-param-reassign */
        if (modifiers.settings) return;
        const data = context.$store.state.cache.cards[value];
        if (!data) return;
        const keys = Object.keys(data);
        const { CACHE_DT } = data;
        if (CACHE_DT) {
          // Default cache timeout is 60s
          const cacheValidity = ((Cards[value].manifest || {}).cacheValidity || 60) * 1000;
          componentInstance.VALID_CACHE = Date.now() < CACHE_DT + cacheValidity;
        }
        for (let i = 0; i < keys.length; i += 1) {
          if (componentInstance.$data[keys[i]] !== undefined) {
            componentInstance.$data[keys[i]] = data[keys[i]];
          }
        }
        /* eslint-enable no-param-reassign */
      },
      unbind: (el, { modifiers }, { context, componentInstance }) => {
        if (modifiers.settings && context.$data.pendingSave && context.saveSettings
          && componentInstance.settings) {
          context.saveSettings(componentInstance.settings);
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
      return Cards[this.id].manifest || {};
    },
    debug() {
      return this.$store.state.settings.debug;
    },
    titleColor() {
      if (this.theme && this.theme.title) {
        if (this.theme.title === 'auto') return undefined;
        return this.theme.title;
      }
      return this.$vuetify.theme.foreground;
    },
    actionsColor() {
      if (this.theme && this.theme.actions) {
        if (this.theme.actions === 'auto') return undefined;
        return this.theme.actions;
      }
      return this.$vuetify.theme.foreground;
    },
    settings() {
      if (!this.cmp.settings || this.hash == null) return {};
      const data = Cards[this.id].settings;
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
    const { id, options } = this;
    const { permissions, origins } = options;
    this.cmp.card = () => import(/* webpackInclude: /\.vue$/, webpackMode: "eager" */`@/cards/${id}/index.vue`)
      .then((tmp) => {
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
      });
    if (Cards[id].settings) {
      this.cmp.settings = () => import(/* webpackInclude: /\.vue$/, webpackChunkName: "cards-settings", webpackMode: "lazy-once" */`@/cards/${id}/settings.vue`)
        .then(tmp => tmp.default);
    }
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
