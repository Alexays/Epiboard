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
    if (!dark) return false;
    if (dark.enabled) {
      if (dark.auto) {
        const from = (dark.from || '22:00').split(':').map(Number);
        const to = (dark.to || '9:00').split(':').map(Number);
        const date = new Date();
        const fromDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          from[0],
          from[1],
          0,
        );
        const toDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          to[0],
          to[1],
          0,
        );
        if (fromDate > toDate) {
          return (!(date > toDate && date < fromDate));
        }
        return (date > fromDate && date < toDate);
      }
      return true;
    }
    return false;
  },
};
