import Toast from '@/components/Toast';

export default {
  name: 'Cards',
  props: ['id'],
  components: {},
  data() {
    return {
      title: null,
      cmp: null,
      settingsCmp: null,
      showSettings: false,
      save: false,
      init: false,
    };
  },
  computed: {
    settings() {
      return Cards.cards[this.id];
    },
  },
  methods: {
    deleteCard() {
      if (this.settings.permissions || this.settings.origins) {
        this.$utils.permissions.remove({
          permissions: this.settings.permissions || [],
          origins: this.settings.origins || [],
        });
      }
      this.$ga.event('cards', 'delete', this.id, 0);
      this.$store.commit('DEL_CARD_SETTINGS', this.id);
      this.$store.commit('DEL_CARD', this.id);
    },
    setCards(data) {
      this.init = true;
      this.$ga.event('cards', 'used', this.id, ((this.$store.state || {}).cards || []).indexOf(this.id));
      if (data instanceof Error) {
        Toast.show({
          text: `${this.id} got a loading error, please try again later.${this.$store.state.settings.debug ? `<br/>${data.message}` : ''}`,
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
    openSettings() {
      this.showSettings = true;
    },
    saveSettings(data) {
      if (this.save) {
        this.$store.commit('SET_CARD_SETTINGS', { key: this.id, data });
        this.save = false;
      }
    },
    getSettings() {
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
  created() {
    const name = Cards.cards[this.id].cmp;
    const settingsName = Cards.settings[this.id];
    this.cmp = () => import(/* webpackMode: "eager" */`@/cards/${name}`)
      .then((tmp) => {
        // TODO: Title in manifest
        if (tmp.default.title) this.title = tmp.default.title;
        const card = Cards.cards[this.id];
        if (!card.permissions && !card.origins) return tmp;
        return this.$utils.permissions.allowed({
          permissions: card.permissions || [],
          origins: card.origins || [],
        }).then((res) => {
          if (!res) {
            Toast.show({
              text: `${this.id} needs new permissions that it cannot have, retry later.`,
              color: 'error',
              timeout: 10000,
              dismissible: false,
            });
            return null;
          }
          return tmp;
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
  mounted() {
  },
};
