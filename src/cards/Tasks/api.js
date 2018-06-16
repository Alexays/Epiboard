import Axios from 'axios';

const clientId = '746645565897-ku61ei4rknbgresomjvrn2vtu6kspsu6.apps.googleusercontent.com';
const redirectUrl = browser.identity.getRedirectURL();
const VALIDATION_BASE_URL = 'https://www.googleapis.com/oauth2/v3/tokeninfo';

export default {
  authorize(scope) {
    let authUrl = 'https://accounts.google.com/o/oauth2/auth';
    authUrl += `?client_id=${clientId}`;
    authUrl += '&response_type=token';
    authUrl += `&redirect_uri=${encodeURIComponent(redirectUrl)}`;
    authUrl += `&scope=${encodeURIComponent(scope)}`;
    return new Promise((resolve, reject) => {
      browser.identity.launchWebAuthFlow({
        interactive: true,
        url: authUrl,
      }, (res) => {
        if (browser.runtime.lastError) return reject(browser.runtime.lastError);
        return resolve(res);
      });
    });
  },
  extractAccessToken(redirectUri) {
    const m = redirectUri.match(/[#?](.*)/);
    if (!m || m.length < 1) {
      return null;
    }
    const params = new URLSearchParams(m[1].split('#')[0]);
    return params.get('access_token');
  },
  validate(redirectURL) {
    const accessToken = this.extractAccessToken(redirectURL);
    if (!accessToken) throw new Error('Authorization failure');
    const validationURL = `${VALIDATION_BASE_URL}?access_token=${accessToken}`;
    return Axios.get(validationURL)
      .then((res) => {
        if (res.data.aud && res.data.aud === clientId) {
          return accessToken;
        }
        throw new Error('Token validation error');
      });
  },
  getAccessToken(scope) {
    return this.authorize(scope)
      .then(url => this.validate(url));
  },
  getList(token) {
    return Axios({
      url: 'https://www.googleapis.com/tasks/v1/users/@me/lists',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
    }).then(res => res.data);
  },
  getAll(token, task = '@default') {
    return Axios({
      url: `https://www.googleapis.com/tasks/v1/lists/${task}/tasks`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
    }).then(res => res.data);
  },
};
