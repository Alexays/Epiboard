import Dialog from '@/components/Dialog';

export default {
  methods: {
    // TODO: avoid useless dialog
    checkPermissions(payload, name) {
      return browser.permissions.contains(payload)
        .then(res => res || browser.permissions.request(payload))
        .catch(() => Dialog.show({
          title: this.$t('permissions.required'),
          text: this.$t('permissions.message', { name }),
          ok: this.$t('permissions.allow'),
          cancel: this.$t('permissions.deny'),
        }).then((res) => {
          if (res) {
            return browser.permissions.request(payload).then((granted) => {
              if (!granted) throw new Error('User has refused');
              return granted;
            });
          }
          throw new Error('User has refused the dialog');
        }));
    },
  },
};
