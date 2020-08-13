import jwtDecode from 'jwt-decode';
import { logout } from '../services/auth';
import * as user from './user';
import * as events from './events';
import * as productions from './productions';

export const getHeaders = (token, apiKey) => ({
  Authorization: `Bearer ${token}`,
  'X-Api-Key': apiKey,
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

export const fetchWithLogoutWhenFailed = (authUrl) => async (...args) => {
  const response = await fetch(...args);
  if (response.status === 401 || response.status === 403) {
    logout(authUrl);
  }
  return response;
};

export default (authUrl, apiUrl, apiKey, tokenCallback) => {
  const fetch = fetchWithLogoutWhenFailed(authUrl);

  const headersCallback = () => {
    const token = tokenCallback();
    if (!isTokenValid(token)) {
      logout(authUrl);
      return;
    }
    return getHeaders(token, apiKey);
  };

  return {
    events: {
      findToModerate: events.findToModerate(apiUrl, headersCallback, fetch),
      findById: events.findById(apiUrl, headersCallback, fetch),
      findByIds: events.findByIds(apiUrl, headersCallback, fetch),
    },
    productions: {
      find: productions.find(apiUrl, headersCallback, fetch),
    },
    user: {
      getMe: user.getMe(apiUrl, headersCallback, fetch),
      getPermissions: user.getPermissions(apiUrl, headersCallback, fetch),
      getRoles: user.getRoles(apiUrl, headersCallback, fetch),
    },
  };
};
