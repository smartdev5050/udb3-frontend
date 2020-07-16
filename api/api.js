import { getMe, getPermissions, getRoles } from './user';

export const getHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  'X-Api-Key': process.env.apiKey,
});

export default (tokenCallback) => {
  const apiUrl = process.env.apiUrl;

  const headersCallback = () => getHeaders(tokenCallback());

  return {
    user: {
      getMe: getMe(apiUrl, headersCallback),
      getPermissions: getPermissions(apiUrl, headersCallback),
      getRoles: getRoles(apiUrl, headersCallback),
    },
  };
};
