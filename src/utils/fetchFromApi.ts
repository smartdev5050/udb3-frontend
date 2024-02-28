import omit from 'lodash/omit';
import getConfig from 'next/config';

class FetchError extends Error {
  status: number;
  body?: DuplicatePlaceErrorBody | any;

  constructor(
    status: number,
    message: string,
    body?: DuplicatePlaceErrorBody | any,
  ) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

type ErrorObject = {
  type: 'ERROR';
  status?: number;
  message: string;
};

type DuplicatePlaceErrorBody = {
  detail: string;
  query?: string;
  duplicatePlaceUri?: string;
  status: number;
  title: string;
  type: string;
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
  searchParams?: { [key: string]: string };
  options?: RequestInit;
  silentError?: boolean;
};

const { publicRuntimeConfig } = getConfig();

const fetchFromApi = async ({
  path,
  searchParams = {},
  options = {},
  silentError = false,
}: FetchFromApiArguments): Promise<ErrorObject | Response> => {
  let response: Response;
  let url: URL;

  try {
    url = new URL(`${publicRuntimeConfig.apiUrl}${path}`);
    searchParams = omit(searchParams, 'queryKey');
    if (typeof searchParams?.q !== 'undefined' && !searchParams?.q) {
      searchParams = omit(searchParams, 'q');
    }

    url.search = new URLSearchParams(searchParams).toString();
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
    let result: { title: string };

    const data = await response.text();

    try {
      result = JSON.parse(data);
    } catch (error) {
      result = { title: data };
    }

    if (!silentError) {
      throw new FetchError(
        response?.status,
        result.title || 'Unknown error',
        result,
      );
    }

    return {
      type: 'ERROR',
      status: response?.status,
      message: result.title || 'Unknown error',
    };
  }

  return response;
};

export { FetchError, fetchFromApi, isErrorObject };
export type { ErrorObject };
