import jwtDecode from 'jwt-decode';
import { logout } from '../services/auth';
import { getMe, getPermissions, getRoles } from './user';
import { findToModerate } from './events';

export const getHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  'X-Api-Key': process.env.apiKey,
});

const isTokenValid = (token) => {
  let decodedToken;
  try {
    decodedToken = jwtDecode(token);
  } catch {
    return false;
  }

  const now = Math.round(Date.now() / 1000);
  return decodedToken.exp - now > 0;
};

export const fetchWithLogoutWhenFailed = async (...args) => {
  const response = await fetch(...args);
  if (response.status === 401 || response.status === 403) {
    logout();
  }
  return response;
};

export default (tokenCallback) => {
  const apiUrl = process.env.apiUrl;

  const headersCallback = () => {
    const token = tokenCallback();
    if (!isTokenValid(token)) {
      logout();
      return;
    }
    return getHeaders(token);
  };

  return {
    events: {
      findToModerate: findToModerate(apiUrl, headersCallback),
    },
    user: {
      getMe: getMe(apiUrl, headersCallback),
      getPermissions: getPermissions(apiUrl, headersCallback),
      getRoles: getRoles(apiUrl, headersCallback),
    },
  };
};
