import Toast from '@/components/Toast';
import Cards from '@/cards';
import Permissions from '@/mixins/permissions';
import Utils from '@/mixins/utils';

// @vue/component
export default {
  name: 'Card',
  directives: {
    initSettings: {
      isLiteral: true,
      bind: (el, { value }, { componentInstance }) => {
        componentInstance.$data.settings = { ...value }; // eslint-disable-line no-param-reassign
      },
      unbind: (el, binding, { context, componentInstance }) => {
        if (context.$options.pendingSave && componentInstance.$data.settings) {
          context.saveSettings(componentInstance.$data.settings);
        }
      },
    },
    init: {
      isLiteral: true,
      bind: (el, { value }, { context, componentInstance }) => {
        /* eslint-disable no-param-reassign */
        const data = context.$store.state.cache.cards[value.id];
        if (!data) return;
        const { CACHE_DT } = data;
        if (CACHE_DT && context.$store.state.cache.validCards.indexOf(value.id) > -1) {
          // Default cache timeout is 60s
          const cacheValidity = ((Cards[value.key].manifest || {}).cacheValidity || 60) * 1000;
          componentInstance.VALID_CACHE = Date.now() < CACHE_DT + cacheValidity;
        }
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i += 1) {
          const key = keys[i];
          if (componentInstance.$data[key] !== undefined) {
            componentInstance.$data[key] = data[key];
          }
        }
        /* eslint-enable no-param-reassign */
      },
    },
  },
  mixins: [Permissions, Utils],
  card: null,
  settings: null,
  pendingSave: false,
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      title: null,
      subTitle: null,
      showSettings: false,
      loaded: 0,
      hash: '',
      actions: [],
    };
  },
  computed: {
    defaultTitle() {
      const translation = this.$t(`${this.$vnode.key}.title`);
      if (translation === `${this.$vnode.key}.title`) return this.$vnode.key;
      return translation;
    },
    theme() {
      if (this.$options.manifest.theme && !this.showSettings) {
        return this.$options.manifest.theme;
      }
      return null;
    },
    debug() {
      return this.$store.state.settings.debug;
    },
    size() {
      return ((this.$options.manifest.size || 1) * 430) - 30;
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
      const defaultSettings = Object.freeze(Cards[this.$vnode.key].settings);
      if (!defaultSettings || this.hash == null) return {};
      const tmp = this.$store.state.cardsSettings.cards[this.name];
      if (!tmp) return defaultSettings;
      const data = { ...defaultSettings };
      const keys = Object.keys(data);
      for (let i = 0; i < keys.length; i += 1) {
        if (typeof data[keys[i]] === typeof tmp[keys[i]]) {
          data[keys[i]] = tmp[keys[i]];
        }
      }
      return data;
    },
  },
  beforeCreate() {
    this.$options.manifest = Cards[this.$vnode.key].manifest || {};
    this.$options.card = () => this.hasPermissions()
      .then(() => import(/* webpackMode: "eager" */`@/cards/${this.$vnode.key}/index.vue`))
      .then(tmp => tmp.default)
      .catch((err) => {
        Toast.show({
          title: this.$t('card.permissions_failed', { id: this.$vnode.key }),
          color: 'error',
          timeout: 10000,
          dismissible: false,
        });
        this.remove();
        throw err;
      });
    if (Cards[this.$vnode.key].settings && Cards[this.$vnode.key].settingsCmp) {
      this.$options.settings = () => import(/* webpackChunkName: "cards-settings", webpackMode: "lazy-once" */`@/cards/${this.$vnode.key}/settings.vue`)
        .then(tmp => tmp.default);
    }
  },
  methods: {
    hasPermissions() {
      const { permissions, origins } = this.$options.manifest;
      // Speed up first frame rendering
      if ((!permissions && !origins)
        || this.$store.state.cache.validCards.indexOf(this.name) > -1) {
        return Promise.resolve();
      }
      const payload = { permissions: permissions || [], origins: origins || [] };
      return this.checkPermissions(payload, this.defaultTitle);
    },
    remove() {
      const { permissions, origins } = this.$options.manifest;
      if (permissions || origins) {
        browser.permissions.remove({
          permissions: permissions || [],
          origins: origins || [],
        });
      }
      this.$emit('deleted');
    },
    init(res) {
      this.loaded = 1;
      if (res === undefined) {
        if (this.$store.state.cache.cards[this.name] !== undefined) {
          this.$store.commit('DEL_CARD_CACHE', this.name);
        }
        this.$store.commit('ADD_VALID_CARD', this.name);
      } else if (res instanceof Error) {
        this.$store.commit('DEL_VALID_CARD', this.name);
        this.loaded = 2;
        Toast.show({
          title: this.$t('card.error', { id: this.name }),
          desc: this.$store.state.settings.debug ? res.message : null,
          color: 'error',
          timeout: 10000,
          dismissible: false,
        });
        if (this.$store.state.settings.debug) throw res;
      } else if (res === true || res === false || Array.isArray(res)) {
        this.$store.commit('ADD_VALID_CARD', this.name);
        const toWatch = Array.isArray(res) ? vm => res.map(f => vm[f]) : '$data';
        this.$refs.card.$watch(toWatch, () => {
          const o = this.$refs.card.$data;
          const data = Array.isArray(res)
            ? res.reduce((r, p) => (p in o ? { ...r, [p]: o[p] } : r), {}) : o;
          this.$store.commit('SET_CARD_CACHE', { key: this.name, data });
        }, { immediate: !!res, deep: true });
      } else if (this.$store.state.settings.debug) {
        console.log(res); // eslint-disable-line
      }
    },
    reload(delCache = true) {
      this.loaded = 0;
      this.subTitle = null;
      this.$store.commit('DEL_VALID_CARD', this.name);
      if (delCache) this.$store.commit('DEL_CARD_CACHE', this.name);
      this.hash = Date.now().toString();
    },
    resetSettings() {
      this.$store.commit('DEL_CARD_SETTINGS', this.name);
      this.hash = Date.now().toString();
    },
    closeSettings(willSave) {
      this.$options.pendingSave = willSave;
      this.showSettings = false;
    },
    saveSettings(data) {
      this.$store.commit('SET_CARD_SETTINGS', { key: this.name, data });
      this.reload(false);
      this.$options.pendingSave = false;
    },
  },
};
