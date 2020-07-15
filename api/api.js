import { getMe, getPermissions, getRoles } from './user';

export default (token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    'X-Api-Key': process.env.apiKey,
  };

  const apiUrl = process.env.apiUrl;

  return {
    user: {
      getMe: getMe(apiUrl, headers),
      getPermissions: getPermissions(apiUrl, headers),
      getRoles: getRoles(apiUrl, headers),
    },
  };
};
