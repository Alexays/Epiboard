import axios from 'axios';

const API = 'http://ws.audioscrobbler.com/2.0/?format=json';

export default {
  getTopArtists(apiKey, user, limit) {
    return axios.get(`${API}&method=user.gettopartists&api_key=${apiKey}&user=${user}&limit=${limit}`)
      .then(res => res.data.topartists);
  },
};
