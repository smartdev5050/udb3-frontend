import getConfig from 'next/config';

const Errors = {
  UNAUTHORIZED: 'unauthorized',
};

const fetchFromApi = async ({ path, searchParams = {}, options = {} }) => {
  const { publicRuntimeConfig } = getConfig();
  const url = new URL(`${publicRuntimeConfig.apiUrl}${path}`);
  url.search = new URLSearchParams(searchParams);
  const response = await fetch(url, options);

  if (response.status === 401 || response.status === 403) {
    throw new Error(Errors.UNAUTHORIZED);
  }
  return response;
};

export { fetchFromApi, Errors };
