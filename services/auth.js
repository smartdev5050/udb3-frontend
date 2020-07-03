import Cookie from 'cookie-universal';
const cookies = Cookie();

export default class UitidAuth {
  removeCookies() {
    cookies.remove('token');
    cookies.remove('user');
  }

  buildBaseUrl() {
    const baseUrl = window.location.protocol + '://' + window.location.host;
    const port = window.location.port;

    return port === '80' ? baseUrl : baseUrl + ':' + port;
  }

  /**
   * Log the active user out.
   */
  logout() {
    this.removeCookies();

    const queryString = new URLSearchParams({
      destination: encodeURIComponent(this.buildBaseUrl()),
    }).toString();

    window.location.href = `${process.env.authUrl}/logout?${queryString}`;
  }

  /**
   * Login by redirecting to UiTiD
   */
  login() {
    this.removeCookies();

    const queryString = new URLSearchParams({
      destination: encodeURIComponent(window.location.href),
      lang: 'nl',
    }).toString();

    window.location.href = `${process.env.authUrl}/connect?${queryString}`;
  }
}
