import * as VList from 'vuetify/es5/components/VList';
import { VCheckbox, VTextField } from 'vuetify';
import Api from './api';

// @vue/component
export default {
  name: 'Tasks',
  components: {
    ...VList,
    VCheckbox,
    VTextField,
  },
  data() {
    return {
      currentId: null,
      tasks: [],
      lists: [],
      editMode: [],
    };
  },
  computed: {
    connected() {
      return this.$store.state.cache.google.accessToken
        && this.$store.state.cache.google.refreshToken;
    },
  },
  mounted() {
    if (this.VALID_CACHE) {
      this.updateMenu();
      this.$emit('init', false);
      return;
    }
    if (!this.connected) {
      this.$emit('init');
      return;
    }
    this.init();
  },
  methods: {
    init() {
      this.$utils.gauth.initialize('https://www.googleapis.com/auth/tasks')
        .then(() => this.getLists())
        .then(() => this.getAll())
        .then(() => this.$emit('init', ['currentId', 'tasks', 'lists']))
        .catch(err => this.$emit('init', err));
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
    editTask(task) {
      const idx = this.editMode.indexOf(task.id);
      Api.updateTask(this.currentId, task);
      this.editMode.splice(idx, 1);
    },
    onStatus(task) {
      if (task.completed) {
        delete task.completed; // eslint-disable-line
      }
      Api.updateTask(this.currentId, task);
    },
    delTask(task, idx) {
      Api.delTask(this.currentId, task.id);
      this.tasks.splice(idx, 1);
    },
  },
};
