export default class UitidAuth {
  removeCookies() {
    // $cookies.remove('token');
    // $cookies.remove('user');
  }

  buildBaseUrl() {
    const baseUrl = window.location.protocol + '://' + window.location.host
    const port = window.location.port

    return port === '80' ? baseUrl : baseUrl + ':' + port
  }

  /**
   * Log the active user out.
   */
  logout() {
    const destination = this.buildBaseUrl()
    let logoutUrl = 'https://jwtprovider.uitdatabank.dev/' + 'logout'

    this.removeCookies()

    // redirect to login page
    logoutUrl += '?destination=' + encodeURIComponent(destination)
    window.location.href = logoutUrl
  }

  /**
   * Login by redirecting to UiTiD
   */
  login() {
    const currentLocation = window.location.href
    let loginUrl = 'https://jwtprovider.uitdatabank.dev/connect'

    this.removeCookies()

    // redirect to login page
    loginUrl +=
      '?destination=' + encodeURIComponent(currentLocation) + '&lang=' + 'nl'
    window.location.href = loginUrl
  }
}
