import getConfig from 'next/config';

const Errors = {
  401: 'unauthorised',
  403: 'forbidden',
  204: 'no_content',
  404: 'bad_request',
};

const fetchFromApi = async ({ path, searchParams = {}, options = {} }) => {
  const { publicRuntimeConfig } = getConfig();
  const url = new URL(`${publicRuntimeConfig.apiUrl}${path}`);
  url.search = new URLSearchParams(searchParams);
  let response;

  try {
    response = await fetch(url, options);
  } catch (e) {
    throw new Error(e.message);
  }

  if (Object.keys(Errors).includes(response.status)) {
    throw new Error(Errors[response.status]);
  }

  return response;
};

export { fetchFromApi, Errors };
