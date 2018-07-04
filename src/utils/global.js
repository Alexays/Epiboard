export default {
  getFavicon(url) {
    const regex = /^(http:|https:)/;
    if (regex.test(url)) {
      return `https://www.google.com/s2/favicons?domain_url=${encodeURI(url)}`;
    }
    return null;
  },
  shuffle(a) {
    return a.length ? a.splice(~~(Math.random() * a.length), 1).concat(this.shuffle(a)) : a;
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
};
