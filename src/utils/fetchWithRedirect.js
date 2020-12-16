import getConfig from 'next/config';

const Errors = {
  UNAUTHORIZED: 'unauthorized',
};

const fetchWithRedirect = async (path, ...args) => {
  const { publicRuntimeConfig } = getConfig();
  console.log({ path, args, apiUrl: publicRuntimeConfig.apiUrl });
  const response = await fetch(`${publicRuntimeConfig.apiUrl}${path}`, ...args);
  if (response.status === 401 || response.status === 403) {
    throw Error(Errors.UNAUTHORIZED);
  }
  return response;
};

export { fetchWithRedirect, Errors };
