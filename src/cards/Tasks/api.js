import Axios from 'axios';

const clientId = '746645565897-ku61ei4rknbgresomjvrn2vtu6kspsu6.apps.googleusercontent.com';
const redirectUrl = browser.identity.getRedirectURL();
const validationBaseUrl = 'https://www.googleapis.com/oauth2/v3/tokeninfo';

export default {
  authorize(scope) {
    const params = [
      `client_id=${clientId}`,
      'response_type=token',
      `redirect_uri=${encodeURIComponent(redirectUrl)}`,
      `scope=${encodeURIComponent(scope)}`,
    ].join('&');
    return new Promise((resolve, reject) => {
      browser.identity.launchWebAuthFlow({
        interactive: true,
        url: `https://accounts.google.com/o/oauth2/auth?${params}`,
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
  validate(accessToken) {
    if (!accessToken) return Promise.reject(new Error('Authorization failure'));
    const validationURL = `${validationBaseUrl}?access_token=${accessToken}`;
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
      .then(url => this.validate(this.extractAccessToken(url)));
  },
  fetch(url, token) {
    return Axios({
      url,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
    }).then(res => res.data);
  },
  getLists(token) {
    return this.fetch('https://www.googleapis.com/tasks/v1/users/@me/lists', token);
  },
  getList(token, id = '@default') {
    return this.fetch(`https://www.googleapis.com/tasks/v1/users/@me/lists/${id}`, token);
  },
  getAll(token, id = '@default') {
    return this.fetch(`https://www.googleapis.com/tasks/v1/lists/${id}/tasks`, token);
  },
};
