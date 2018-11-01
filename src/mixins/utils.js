export default {
  filters: {
    bytes(nb) {
      if (!nb || Number.isNaN(parseFloat(nb)) || !Number.isFinite(nb)) return '-';
      const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];
      const idx = Math.floor(Math.log(nb) / Math.log(1024));
      return `${(nb / (1024 ** Math.floor(idx))).toFixed(1)} ${units[idx]}`;
    },
    truncate(string, nb) {
      if (!string) return '';
      const trimmed = string.trim();
      if (trimmed.length < nb) {
        return trimmed;
      }
      return `${trimmed.substring(0, nb)}...`;
    },
    filename(path) {
      if (path) {
        return path.substring(path.lastIndexOf(path.indexOf('/') > -1 ? '/' : '\\') + 1);
      }
      return '';
    },
  },
  methods: {
    getFavicon(url, size) {
      if (!size && (url.indexOf('https://') === 0 || url.indexOf('http://') === 0)) {
        return `https://www.google.com/s2/favicons?domain_url=${encodeURI(url)}`;
      }
      if (size) {
        return `https://api.faviconkit.com/${encodeURI(url)}/${size}`;
      }
      return null;
    },
    shuffle(f) {
      return f.map(a => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map(a => a[1]);
    },
    gotTo(url) {
      const payload = { permissions: ['tabs'] };
      browser.permissions.contains(payload)
        .then(res => res || browser.permissions.request(payload))
        .then(() => {
          browser.tabs.update({ url });
        });
    },
  },
};
