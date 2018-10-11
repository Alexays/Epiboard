import gauth from '@/mixins/auth/google';

export default {
  mixins: [gauth],
  methods: {
    $getLists() {
      return this.$gauth_http('GET', 'https://www.googleapis.com/tasks/v1/users/@me/lists');
    },
    $getList(id = '@default') {
      return this.$gauth_http('GET', `https://www.googleapis.com/tasks/v1/users/@me/lists/${id}`);
    },
    $getAll(id = '@default') {
      return this.$gauth_http('GET', `https://www.googleapis.com/tasks/v1/lists/${id}/tasks`);
    },
    $updateTask(list, payload) {
      return this.$gauth_http(
        'PUT',
        `https://www.googleapis.com/tasks/v1/lists/${list}/tasks/${payload.id}`,
        payload,
      );
    },
    $delTask(list, id) {
      return this.$gauth_http('DELETE', `https://www.googleapis.com/tasks/v1/lists/${list}/tasks/${id}`);
    },
    $addTask(list, payload) {
      return this.$gauth_http(
        'POST',
        `https://www.googleapis.com/tasks/v1/lists/${list}/tasks`,
        payload,
      );
    },
  },
};
