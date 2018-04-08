import Dialog from '@/components/Dialog';

export default {
  getAll() {
    return new Promise((resolve, reject) => {
      browser.permissions.getAll((res) => {
        if (browser.runtime.lastError) return reject(browser.runtime.lastError);
        return resolve(res);
      });
    });
  },
  contains(payload) {
    return new Promise((resolve, reject) => {
      browser.permissions.contains(payload, (res) => {
        if (browser.runtime.lastError) return reject(browser.runtime.lastError);
        return resolve(res);
      });
    });
  },
  request(payload) {
    return new Promise((resolve, reject) => {
      browser.permissions.request(payload, (res) => {
        if (browser.runtime.lastError) return reject(browser.runtime.lastError);
        return resolve(res);
      });
    });
  },
  remove(payload) {
    return new Promise((resolve, reject) => {
      browser.permissions.remove(payload, (res) => {
        if (browser.runtime.lastError) return reject(browser.runtime.lastError);
        return resolve(res);
      });
    });
  },
  allowed(payload) {
    return this.contains(payload)
      .then((res) => {
        if (res) return res;
        return this.request(payload);
      }).catch((err) => {
        if (err.message === 'This function must be called during a user gesture') {
          return Dialog.show({
            title: 'Permissions are required',
            text: 'A card request permission that is necessary for it to work properly, are you okay?',
            ok: 'Allow',
            cancel: 'Deny',
          }).then((res) => {
            if (res) return this.allowed(payload);
            throw new Error('User has refused');
          });
        }
        throw err;
      });
  },
};
