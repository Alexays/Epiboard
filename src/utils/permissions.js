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
      });
  },
};
