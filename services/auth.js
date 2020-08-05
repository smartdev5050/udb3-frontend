import Cookie from 'cookie-universal';

const removeCookies = () => {
  const cookies = Cookie();

  cookies.remove('token');
  cookies.remove('user');
};

const buildBaseUrl = () =>
  `${window.location.protocol}//${window.location.host}`;

/**
 * Log the active user out.
 */
export const logout = (authUrl) => {
  removeCookies();

  const queryString = new URLSearchParams({
    destination: buildBaseUrl(),
  }).toString();

  window.location.href = `${authUrl}/logout?${queryString}`;
};

/**
 * Login by redirecting to UiTiD
 */
export const login = (authUrl) => {
  removeCookies();

  const queryString = new URLSearchParams({
    destination: buildBaseUrl(),
    lang: 'nl',
  }).toString();

  window.location.href = `${authUrl}/connect?${queryString}`;
};
