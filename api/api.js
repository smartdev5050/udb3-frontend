import jwtDecode from 'jwt-decode';
import { logout } from '../services/auth';
import { getMe, getPermissions, getRoles } from './user';

export const getHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  'X-Api-Key': process.env.apiKey,
});

const isTokenValid = (token) => {
  const { exp } = jwtDecode(token);
  const now = Math.round(Date.now() / 1000);
  return exp - now > 0;
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
