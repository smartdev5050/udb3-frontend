import {
  getStatusFromResults,
  QueryStatus,
  useAuthenticatedQuery,
} from './authenticated-query';

import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { fetchFromApi } from '../../utils/fetchFromApi';
import base64 from 'base-64';

const createCookieWithToken = () => {
  const header = base64.encode(JSON.stringify({ test: 'ok' }));
  const payload = base64.encode(
    // eslint-disable-next-line no-loss-of-precision
    JSON.stringify({ exp: 99999999999999999999999999999999999999999 }),
  );
  const token = [header, payload, 'SIGNATURE'].join('.');

  Object.defineProperty(window.document, 'cookie', {
    writable: true,
    value: `token=${token}`,
  });
};

const createReactQueryWrapper = () => {
  const queryClient = new QueryClient();
  // eslint-disable-next-line react/prop-types
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const queryFn = async ({ headers, ...queryData }) => {
  const res = await fetchFromApi({
    path: '/random',
    options: {
      headers,
    },
  });
  return await res.json();
};

jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '',
    query: '',
    asPath: '',
    push: () => {},
  }),
}));

describe('getStatusFromResults', () => {
  it('returns error when one result is errror', async () => {
    const result = getStatusFromResults([
      { status: QueryStatus.SUCCESS },
      { status: QueryStatus.ERROR, error: 'this is an error' },
      { status: QueryStatus.ERROR, error: 'this is another error' },
      { status: QueryStatus.SUCCESS },
    ]);
    expect(result).toStrictEqual({
      status: QueryStatus.ERROR,
      error: ['this is an error', 'this is another error'],
    });
  });

  it('returns success when every result is a success', async () => {
    const result = getStatusFromResults([
      { status: QueryStatus.SUCCESS },
      { status: QueryStatus.SUCCESS },
    ]);
    expect(result).toStrictEqual({
      status: QueryStatus.SUCCESS,
    });
  });

  it('returns idle when one results is idle', async () => {
    const result = getStatusFromResults([
      { status: QueryStatus.SUCCESS },
      { status: QueryStatus.IDLE },
    ]);
    expect(result).toStrictEqual({
      status: QueryStatus.IDLE,
    });
  });

  it('returns idle when one results is loading', async () => {
    const result = getStatusFromResults([
      { status: QueryStatus.IDLE },
      { status: QueryStatus.LOADING },
    ]);
    expect(result).toStrictEqual({
      status: QueryStatus.LOADING,
    });
  });
});

describe('useAuthenticatedQuery', () => {
  beforeEach(() => {
    fetch.resetMocks();
    createCookieWithToken();
  });

  it('returns data', async () => {
    const data = { data: '12345' };
    fetch.mockResponseOnce(JSON.stringify(data));

    const { result, waitFor } = renderHook(
      () =>
        useAuthenticatedQuery({
          queryKey: ['random'],
          queryFn,
        }),
      { wrapper: createReactQueryWrapper() },
    );

    await waitFor(() => {
      return result.current.isSuccess;
    });

    expect(result.current.data).toStrictEqual(data);
  });
  it('fails on not response ok', async () => {
    const message = 'This is an error';
    fetch.mockResponseOnce(JSON.stringify({ title: message }), {
      status: 400,
    });

    const { result, waitFor } = renderHook(
      () =>
        useAuthenticatedQuery({
          retry: false, // disable retry, otherwise the waitFor times out
          queryKey: ['random'],
          queryFn,
        }),
      { wrapper: createReactQueryWrapper() },
    );

    await waitFor(() => {
      return result.current.isError;
    });

    expect(result.current.error.message).toStrictEqual(message);
  });
  it('redirect on 401 or 403', async () => {
    const message = 'no permission';
    fetch.mockResponseOnce(JSON.stringify({ title: message }), {
      status: 401,
    });

    renderHook(
      () =>
        useAuthenticatedQuery({
          retry: false, // disable retry, otherwise the waitFor times out
          queryKey: ['random'],
          queryFn,
        }),
      { wrapper: createReactQueryWrapper() },
    );

    // validate that push has been called on router

    expect(true).toStrictEqual(false);
  });
});
