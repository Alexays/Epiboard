import Dialog from '@/components/Dialog';
import { i18n } from '@/i18n';

export default {
  getFavicon(url) {
    if (url.indexOf('https://') === 0 || url.indexOf('http://') === 0) {
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
  // TODO: avoid useless dialog
  checkPermissions(payload, name) {
    return browser.permissions.contains(payload)
      .then(res => res || browser.permissions.request(payload))
      .catch(() => Dialog.show({
        title: i18n.t('permissions.required'),
        text: i18n.t('permissions.message', { name }),
        ok: i18n.t('permissions.allow'),
        cancel: i18n.t('permissions.deny'),
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
  gotTo(url) {
    const payload = { permissions: ['tabs'] };
    browser.permissions.contains(payload)
      .then(res => res || browser.permissions.request(payload))
      .then(() => {
        browser.tabs.update({ url });
      });
  },
};
