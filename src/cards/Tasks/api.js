import Vue from 'vue';

export default {
  getLists() {
    return Vue.utils.gauth
      .http('GET', 'https://www.googleapis.com/tasks/v1/users/@me/lists');
  },
  getList(id = '@default') {
    return Vue.utils.gauth
      .http('GET', `https://www.googleapis.com/tasks/v1/users/@me/lists/${id}`);
  },
  getAll(id = '@default') {
    return Vue.utils.gauth
      .http('GET', `https://www.googleapis.com/tasks/v1/lists/${id}/tasks`);
  },
  updateTask(list, payload) {
    return Vue.utils.gauth
      .http(
        'PUT',
        `https://www.googleapis.com/tasks/v1/lists/${list}/tasks/${payload.id}`,
        payload,
      );
  },
  delTask(list, id) {
    return Vue.utils.gauth
      .http('DELETE', `https://www.googleapis.com/tasks/v1/lists/${list}/tasks/${id}`);
  },
};
