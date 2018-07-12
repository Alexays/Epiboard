import axios from 'axios';

const API = 'http://ws.audioscrobbler.com/2.0/?format=json';
const fallback = 'https://lastfm-img2.akamaized.net/i/u/300x300/c6f59c1e5e7240a4c0d427abd71f3dbb';

export default {
  parseRes(res) {
    return res.map((f) => {
      f.image = {
        small: f.image[0]['#text'] !== '' ? f.image[0]['#text'] : fallback,
        medium: f.image[1]['#text'] !== '' ? f.image[1]['#text'] : fallback,
        large: f.image[2]['#text'] !== '' ? f.image[2]['#text'] : fallback,
        extralarge: f.image[3]['#text'] !== '' ? f.image[3]['#text'] : fallback,
      };
      return f;
    });
  },
  fetchTopUser(type, apiKey, user, limit, period) {
    return axios.get(`${API}&method=user.get${type}&api_key=${apiKey}&user=${user}&limit=${limit}&period=${period}`)
      .then(res => res.data[type]);
  },
  getTopArtists(apiKey, user, limit, period) {
    return this.fetchTopUser('topartists', apiKey, user, limit, period)
      .then(topartists => this.parseRes(topartists.artist));
  },
  getTopAlbums(apiKey, user, limit, period) {
    return this.fetchTopUser('topalbums', apiKey, user, limit, period)
      .then(topalbums => this.parseRes(topalbums.album));
  },
  getTopTracks(apiKey, user, limit, period) {
    return this.fetchTopUser('toptracks', apiKey, user, limit, period)
      .then(toptracks => this.parseRes(toptracks.track));
  },
  getRecentTracks(apiKey, user, limit) {
    return axios.get(`${API}&method=user.getrecenttracks&api_key=${apiKey}&user=${user}&limit=${limit}`)
      .then(res => res.data.recenttracks.track);
  },
};
