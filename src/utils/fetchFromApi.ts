import getConfig from 'next/config';

class FetchError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type FetchFromApiArguments = {
  path: string;
  searchParams?: Record<string, string>;
  options?: Record<string, unknown>;
  silentError?: boolean;
};

const fetchFromApi = async ({
  path,
  searchParams = {},
  options = {},
  silentError = false,
}: FetchFromApiArguments) => {
  const { publicRuntimeConfig } = getConfig();

  let response: Response;
  let url: URL;

  try {
    url = new URL(`${publicRuntimeConfig.apiUrl}${path}`);
    url.search = new URLSearchParams(searchParams).toString();
  } catch (e) {
    if (!silentError) {
      throw new Error(e.message);
    }
    return {
      type: 'ERROR',
      message: e.message ?? 'Unknown error',
    };
  }

  try {
    response = await fetch(url.toString(), options);
  } catch (e) {
    if (!silentError) {
      throw new Error(e.message);
    }

    return {
      type: 'ERROR',
      message: e.message ?? 'Unknown error',
    };
  }

  if (!response.ok) {
    const result = await response.json();

    if (!silentError) {
      throw new FetchError(response?.status, result?.title ?? 'Unknown error');
    }

    return {
      type: 'ERROR',
      status: response?.status,
      message: result?.title ?? 'Unknown error',
    };
  }

  return response;
};

export { fetchFromApi };
