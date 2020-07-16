import { getMe, getPermissions, getRoles } from './user';

export const getHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  'X-Api-Key': process.env.apiKey,
});

export default (tokenCallback) => {
  const apiUrl = process.env.apiUrl;

  const headers = getHeaders(tokenCallback());

  return {
    user: {
      getMe: getMe(apiUrl, headers),
      getPermissions: getPermissions(apiUrl, headers),
      getRoles: getRoles(apiUrl, headers),
    },
  };
};
