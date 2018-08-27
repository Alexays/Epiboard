import Axios from 'axios';
import store from '@/store';

const clientId = '746645565897-flmj7tj1hu754tl4uul2do8cq1sslp27.apps.googleusercontent.com';
const clientSecret = 'vP98OJ0nebq8qbeoBzKT5HvG';
const redirectUrl = browser.identity.getRedirectURL();

const apiUrl = {
  webAuth: 'https://accounts.google.com/o/oauth2/v2/auth',
  revoke: 'https://accounts.google.com/o/oauth2/revoke',
  token: 'https://www.googleapis.com/oauth2/v3/token',
  tokenInfo: 'https://www.googleapis.com/oauth2/v3/tokeninfo',
};

export default {
  authorize(scope) {
    const params = [
      `client_id=${clientId}`,
      'response_type=code',
      'access_type=offline',
      'include_granted_scopes=true',
      'prompt=consent',
      `redirect_uri=${encodeURIComponent(redirectUrl)}`,
      `scope=${encodeURIComponent(scope)}`,
    ].join('&');
    return browser.identity.launchWebAuthFlow({
      interactive: true,
      url: `${apiUrl.webAuth}?${params}`,
    });
  },
  extractCode(redirectUri) {
    const m = redirectUri.match(/[#?](.*)/);
    if (!m || m.length < 1) {
      return null;
    }
    const params = new URLSearchParams(m[1].split('#')[0]);
    return params.get('code');
  },
  isConnected() {
    return store.state.cache.google.accessToken && store.state.cache.google.refreshToken;
  },
  initialize(scope) {
    if (!this.isConnected()) {
      return this.authorize(scope).then(url => this.getTokens(this.extractCode(url)));
    }
    return this.validateTokens(scope);
  },
  validateTokens() {
    return Axios
      .get(`${apiUrl.tokenInfo}?access_token=${store.state.cache.google.accessToken}`)
      .catch(() => this.revokeTokens());
  },
  revokeTokens() {
    const params = [
      `client_id=${clientId}`,
      `client_secret=${clientSecret}`,
      'grant_type=refresh_token',
      `refresh_token=${store.state.cache.google.refreshToken}`,
    ].join('&');
    return Axios.post(`${apiUrl.token}?${params}`)
      .then((res) => {
        store.commit('SET_GOOGLE', {
          refreshToken: store.state.cache.google.refreshToken,
          accessToken: res.data.access_token,
          exp: Date.now() + (res.data.expire_in * 1000),
        });
      })
      .catch((err) => {
        store.commit('DEL_GOOGLE');
        throw err;
      });
  },
  revoke() {
    return Axios.post(`${apiUrl.revoke}?token=${store.state.cache.google.accessToken}`)
      .then(() => {
        store.commit('DEL_GOOGLE');
      });
  },
  getTokens(code) {
    const params = [
      `client_id=${clientId}`,
      `client_secret=${clientSecret}`,
      `redirect_uri=${encodeURIComponent(redirectUrl)}`,
      'grant_type=authorization_code',
      `code=${code}`,
    ].join('&');
    return Axios.post(`${apiUrl.token}?${params}`)
      .then((res) => {
        store.commit('SET_GOOGLE', {
          accessToken: res.data.access_token,
          refreshToken: res.data.refresh_token,
          exp: Date.now() + (res.data.expire_in * 1000),
        });
        return res.data.access_token;
      });
  },
  fetch(url) {
    return Axios({
      url,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${store.state.cache.google.accessToken}`,
        'Content-type': 'application/json',
      },
    }).then(res => res.data);
  },
};
