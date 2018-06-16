import VCheckbox from 'vuetify/es5/components/VCheckbox';
import * as VList from 'vuetify/es5/components/VList';
import Api from './api';

export default {
  name: 'Tasks',
  props: ['menus'],
  components: {
    VCheckbox,
    ...VList,
  },
  data() {
    return {
      token: null,
      tasks: [],
      list: [],
    };
  },
  methods: {
    init() {
      return Api.getAccessToken('https://www.googleapis.com/auth/tasks').then((token) => {
        this.token = token;
      });
    },
    updateMenu() {
      this.$emit('update:menus', this.list.map(f => ({
        title: f.title,
        func: () => this.getTasksList(f.id),
      })));
    },
    getList() {
      return Api.getList(this.token).then((list) => {
        this.list = list.items;
        this.updateMenu();
      });
    },
    getTasksList(id) {
      return Api.getAll(this.token, id).then((tasks) => {
        this.tasks = tasks.items;
      });
    },
    getAll() {
      return Api.getAll(this.token).then((tasks) => {
        this.tasks = tasks.items;
      });
    },
  },
  mounted() {
    if (this.VALID_CACHE) {
      this.updateMenu();
      this.$emit('init', true);
      return;
    }
    this.init()
      .then(() => this.getList())
      .then(() => this.getAll())
      .then(() => this.$emit('init', this.$data))
      .catch(err => this.$emit('init', err));
  },
};
