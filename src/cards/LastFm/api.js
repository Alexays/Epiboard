import axios from 'axios';

const API = 'http://ws.audioscrobbler.com/2.0/?format=json';
const fallback = 'https://lastfm-img2.akamaized.net/i/u/300x300/c6f59c1e5e7240a4c0d427abd71f3dbb';

export default {
  parseImage(image) {
    return {
      small: image[0]['#text'] !== '' ? image[0]['#text'] : fallback,
      medium: image[1]['#text'] !== '' ? image[1]['#text'] : fallback,
      large: image[2]['#text'] !== '' ? image[2]['#text'] : fallback,
      extralarge: image[3]['#text'] !== '' ? image[3]['#text'] : fallback,
    };
  },
  getTopArtists(apiKey, user, limit, period) {
    return axios.get(`${API}&method=user.gettopartists&api_key=${apiKey}&user=${user}&limit=${limit}&period=${period}`)
      .then(res => res.data.topartists.artist.map((f) => {
        f.image = this.parseImage(f.image);
        return f;
      }));
  },
  getTopAlbums(apiKey, user, limit, period) {
    return axios.get(`${API}&method=user.gettopalbums&api_key=${apiKey}&user=${user}&limit=${limit}&period=${period}`)
      .then(res => res.data.topalbums.album.map((f) => {
        f.image = this.parseImage(f.image);
        return f;
      }));
  },
  getTopTracks(apiKey, user, limit, period) {
    return axios.get(`${API}&method=user.gettoptracks&api_key=${apiKey}&user=${user}&limit=${limit}&period=${period}`)
      .then(res => res.data.toptracks.track.map((f) => {
        f.image = this.parseImage(f.image);
        return f;
      }));
  },
  getRecentTracks(apiKey, user, limit) {
    return axios.get(`${API}&method=user.getrecenttracks&api_key=${apiKey}&user=${user}&limit=${limit}`)
      .then(res => res.data.recenttracks.track);
  },
};
