import omit from 'lodash/omit';
import getConfig from 'next/config';

class FetchError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type ErrorObject = {
  type: 'ERROR';
  status?: number;
  message: string;
};

const isErrorObject = (value: any): value is ErrorObject => {
  return (
    value.type === 'ERROR' &&
    typeof value.message === 'string' &&
    (!value.status || typeof value.status === 'number')
  );
};

const fetchFromApi = async ({
  path,
  searchParams = {},
  options = {},
  silentError = false,
}): Promise<ErrorObject | Response> => {
  const { publicRuntimeConfig } = getConfig();

  // eslint-disable-next-line no-console
  console.log({ publicRuntimeConfig });

  let response: Response;
  let url: URL;

  try {
    url = new URL(`${publicRuntimeConfig.apiUrl}${path}`);
    url.search = new URLSearchParams(omit(searchParams, 'queryKey')).toString();
  } catch (e) {
    if (!silentError) {
      throw new FetchError(400, e?.message ?? 'Unknown error');
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
      throw new FetchError(response?.status, e?.message ?? 'Unknown error');
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

export { FetchError, fetchFromApi, isErrorObject };
export type { ErrorObject };
