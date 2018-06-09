import * as VList from 'vuetify/es5/components/VList';
import VMenu from 'vuetify/es5/components/VMenu';
import Toast from '@/components/Toast';

export default {
  name: 'Cards',
  props: ['id'],
  components: {
    ...VList,
    VMenu,
  },
  data() {
    return {
      title: null,
      cmp: null,
      settingsCmp: null,
      showSettings: false,
      save: false,
      init: false,
      hash: '',
    };
  },
  computed: {
    options() {
      return Cards.cards[this.id];
    },
    settings() {
      if (!this.settingsCmp || this.hash == null) return {};
      const data = this.settingsCmp.data();
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
  methods: {
    deleteCard() {
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
    initCard(data) {
      this.init = true;
      if (data instanceof Error) {
        Toast.show({
          text: `${this.id} got a loading error, please try again later${this.$store.state.settings.debug ? `: ${data.message}` : ''}.`,
          color: 'error',
          timeout: 10000,
          dismissible: false,
        });
        return;
      }
      if (data === undefined && this.$store.state.cache.cards[this.id] !== undefined) {
        this.$store.commit('DEL_CARD_CACHE', this.id);
        return;
      }
      if (data !== true) {
        this.$store.commit('SET_CARD_CACHE', { key: this.id, data });
      }
    },
    closeSettings(save) {
      this.save = save;
      this.showSettings = false;
    },
    saveSettings(data) {
      if (this.save) {
        this.$store.commit('SET_CARD_SETTINGS', { key: this.id, data });
        this.$store.commit('DEL_CARD_CACHE', this.id);
        this.hash = Date.now().toString();
        this.save = false;
      }
    },
  },
  created() {
    const { id } = this;
    const card = Cards.cards[id];
    const settingsName = Cards.settings[id];
    this.cmp = () => import(/* webpackMode: "eager" */`@/cards/${card.cmp}`)
      .then((tmp) => {
        if (tmp.default.title) this.title = tmp.default.title;
        if (!card.permissions && !card.origins) return tmp.default;
        return this.$utils.permissions.allowed({
          permissions: card.permissions || [],
          origins: card.origins || [],
        }).then((res) => {
          if (!res) {
            Toast.show({
              text: `${id} needs new permissions that it cannot have, retry later.`,
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
        if (settingsName) {
          return import(`@/cards/${settingsName}`)
            .then((data) => {
              this.settingsCmp = data.default;
              return tmp;
            });
        }
        return tmp;
      });
  },
};
