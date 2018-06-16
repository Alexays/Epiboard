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
      lists: [],
      currentId: null,
    };
  },
  methods: {
    init() {
      return Api.getAccessToken('https://www.googleapis.com/auth/tasks').then((token) => {
        this.token = token;
      });
    },
    updateMenu() {
      this.$emit('update:menus', this.lists.map(f => ({
        title: f.title,
        active: f.id === this.currentId,
        func: () => {
          this.getTasksList(f.id);
          this.currentId = f.id;
          this.updateMenu();
        },
      })));
    },
    getLists() {
      return Api.getLists(this.token).then((lists) => {
        this.lists = lists.items;
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
        Api.getList(this.token).then((list) => {
          this.currentId = list.id;
          this.updateMenu();
        });
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
      .then(() => this.getLists())
      .then(() => this.getAll())
      .then(() => this.$emit('init', this.$data))
      .catch(err => this.$emit('init', err));
  },
};
