import Api from './api';

// @vue/component
export default {
  name: 'Tasks',
  mixins: [Api],
  data() {
    return {
      currentId: null,
      tasks: [],
      lists: [],
      editMode: [],
      newTask: '',
      loading: false,
    };
  },
  mounted() {
    if (this.VALID_CACHE) {
      this.updateMenu();
      this.$emit('init', false);
      return;
    }
    if (!this.$gauth_isConnected) {
      this.$emit('init');
      return;
    }
    this.init();
  },
  methods: {
    init() {
      this.$gauth_initialize('https://www.googleapis.com/auth/tasks')
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
      return this.$getLists().then((lists) => {
        this.lists = lists.items;
      });
    },
    getTasksList(id) {
      this.loading = true;
      return this.$getAll(id).then((tasks) => {
        this.tasks = tasks.items;
        this.currentId = id;
        this.updateMenu();
        this.loading = false;
      });
    },
    getAll() {
      this.loading = true;
      return this.$getAll().then((tasks) => {
        this.tasks = tasks.items;
        this.$getList().then((list) => {
          this.currentId = list.id;
          this.updateMenu();
          this.loading = false;
        });
      });
    },
    editTask(task) {
      const idx = this.editMode.indexOf(task.id);
      this.$updateTask(this.currentId, task);
      this.editMode.splice(idx, 1);
    },
    onStatus(task) {
      if (task.completed) {
        delete task.completed; // eslint-disable-line
      }
      this.$updateTask(this.currentId, task);
    },
    delTask(task, idx) {
      this.$delTask(this.currentId, task.id);
      this.tasks.splice(idx, 1);
    },
    addTask() {
      this.loading = true;
      this.$addTask(this.currentId, {
        title: this.newTask,
      }).then(() => this.getTasksList(this.currentId))
        .then(() => {
          this.newTask = '';
          this.loading = false;
        });
    },
  },
};
