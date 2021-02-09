import getConfig from 'next/config';

class FetchError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const fetchFromApi = async ({
  path,
  searchParams = {},
  options = {},
  silentError = false,
} = {}) => {
  const { publicRuntimeConfig } = getConfig();

  const url = new URL(`${publicRuntimeConfig.apiUrl}${path}`);
  url.search = new URLSearchParams(searchParams);

  let response;

  try {
    response = await fetch(url, options);
  } catch (e) {
    if (silentError) {
      return {
        type: 'ERROR',
        message: e.message ?? 'Unknown error',
      };
    } else {
      throw new Error(e.message);
    }
  }

  if (!response.ok) {
    const result = await response.json();
    if (silentError) {
      return {
        type: 'ERROR',
        status: response?.status,
        message: result?.title ?? 'Unknown error',
      };
    } else {
      throw new FetchError(response?.status, result?.title ?? 'Unknown error');
    }
  }

  return response;
};

export { fetchFromApi };
