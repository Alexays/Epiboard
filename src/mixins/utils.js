export default {
  methods: {
    getFavicon(url, size) {
      if (!size && (url.indexOf('https://') === 0 || url.indexOf('http://') === 0)) {
        return `https://www.google.com/s2/favicons?domain_url=${encodeURI(url)}`;
      } else if (size) {
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
