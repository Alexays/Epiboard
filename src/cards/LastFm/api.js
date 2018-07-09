import axios from 'axios';

const API = 'http://ws.audioscrobbler.com/2.0/?format=json';

export default {
  getTopArtists(apiKey, user, limit, period) {
    return axios.get(`${API}&method=user.gettopartists&api_key=${apiKey}&user=${user}&limit=${limit}&period=${period}`)
      .then(res => res.data.topartists);
  },
  getRecentTracks(apiKey, user, limit) {
    return axios.get(`${API}&method=user.getrecenttracks&api_key=${apiKey}&user=${user}&limit=${limit}`)
      .then(res => res.data.recenttracks);
  },
};
