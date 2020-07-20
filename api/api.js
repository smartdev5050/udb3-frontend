import jwtDecode from 'jwt-decode';
import { logout } from '../services/auth';
import { getMe, getPermissions, getRoles } from './user';

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
  if (!response.ok) {
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
    user: {
      getMe: getMe(apiUrl, headersCallback),
      getPermissions: getPermissions(apiUrl, headersCallback),
      getRoles: getRoles(apiUrl, headersCallback),
    },
  };
};
