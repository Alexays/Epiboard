import Dialog from '@/components/Dialog';

export default {
  getFavicon(url) {
    const regex = /^(http:|https:)/;
    if (regex.test(url)) {
      return `https://www.google.com/s2/favicons?domain_url=${encodeURI(url)}`;
    }
    return null;
  },
  shuffle(f) {
    return f.map(a => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map(a => a[1]);
  },
  isDark(dark) {
    if (!dark || !dark.enabled) return false;
    if (!dark.auto) return true;
    const from = (dark.from || '22:00').split(':').map(Number);
    const to = (dark.to || '9:00').split(':').map(Number);
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const fromDate = new Date(year, month, day, from[0], from[1]).getTime();
    const toDate = new Date(year, month, day, to[0], to[1]).getTime();
    const time = date.getTime();
    if (fromDate > toDate) {
      return (!(time > toDate && time < fromDate));
    }
    return (time > fromDate && time < toDate);
  },
  checkPermissions(payload, name) {
    return browser.permissions.contains(payload)
      .then(res => res || browser.permissions.request(payload))
      .catch(() => Dialog.show({
        title: 'Permissions are required',
        text: `${name} ask for permissions that are necessary for it to work properly, is that okay?`,
        ok: 'Allow',
        cancel: 'Deny',
      }).then((res) => {
        if (res) {
          return browser.permissions.request(payload).then((granted) => {
            if (!granted) throw new Error('User has refused');
            return granted;
          });
        }
        throw new Error('User has refused dialog');
      }));
  },
};
