import { getMe, getPermissions, getRoles } from './user';

const isFunction = (functionToCheck) =>
  functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';

export const getHeaders = (token) => ({
  Authorization: `Bearer ${isFunction(token) ? token() : token}`,
  'X-Api-Key': process.env.apiKey,
});

export default (token) => {
  const apiUrl = process.env.apiUrl;

  return {
    user: {
      getMe: getMe(apiUrl, token),
      getPermissions: getPermissions(apiUrl, token),
      getRoles: getRoles(apiUrl, token),
    },
  };
};
