import * as VList from 'vuetify/es5/components/VList';
import { VCheckbox } from 'vuetify';
import Api from './api';

// @vue/component
export default {
  name: 'Tasks',
  components: {
    ...VList,
    VCheckbox,
  },
  data() {
    return {
      token: null,
      currentId: null,
      tasks: [],
      lists: [],
    };
  },
  mounted() {
    if (this.VALID_CACHE) {
      this.updateMenu();
      this.$emit('init', true);
      return;
    }
    this.getToken()
      .then(() => this.getLists())
      .then(() => this.getAll())
      .then(() => this.$emit('init', this.$data))
      .catch(err => this.$emit('init', err));
  },
  methods: {
    getToken() {
      return Api.validate(this.token)
        .catch(() => Api.getAccessToken('https://www.googleapis.com/auth/tasks'))
        .then((token) => {
          this.token = token;
        });
    },
    updateMenu() {
      const action = this.lists.map(f => ({
        title: f.title,
        active: f.id === this.currentId,
        func: () => this.getTasksList(f.id),
      }));
      this.$emit('update:actions', action);
    },
    getLists() {
      return Api.getLists(this.token).then((lists) => {
        this.lists = lists.items;
      });
    },
    getTasksList(id) {
      return Api.getAll(this.token, id).then((tasks) => {
        this.tasks = tasks.items;
        this.currentId = id;
        this.updateMenu();
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
};
