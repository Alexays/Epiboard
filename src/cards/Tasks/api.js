import Vue from 'vue';

export default {
  getLists() {
    return Vue.utils.gauth
      .fetch('https://www.googleapis.com/tasks/v1/users/@me/lists');
  },
  getList(id = '@default') {
    return Vue.utils.gauth
      .fetch(`https://www.googleapis.com/tasks/v1/users/@me/lists/${id}`);
  },
  getAll(id = '@default') {
    return Vue.utils.gauth
      .fetch(`https://www.googleapis.com/tasks/v1/lists/${id}/tasks`);
  },
};
