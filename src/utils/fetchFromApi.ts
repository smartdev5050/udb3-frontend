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

type FetchFromApiArguments = {
  path: string;
  searchParams?: Record<string, string>;
  options?: { headers?: Record<string, string>; [key: string]: unknown };
  silentError?: boolean;
};

const fetchFromApi = async ({
  path,
  searchParams = {},
  options = {},
  silentError = false,
}: FetchFromApiArguments): Promise<Response | ErrorObject> => {
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

export { fetchFromApi, isErrorObject };
export type { ErrorObject };
