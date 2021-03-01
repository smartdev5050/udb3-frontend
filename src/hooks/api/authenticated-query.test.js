import {
  getStatusFromResults,
  QueryStatus,
  useAuthenticatedQuery,
} from './authenticated-query';

import { mockResponses, setupPage } from '../../tests/utils/setupPage';
import { renderHookWithWrapper } from '../../tests/utils/renderHookWithWrapper';
import { fetchFromApi } from '../../utils/fetchFromApi';

const queryFn = async ({ headers, ...queryData }) => {
  const res = await fetchFromApi({
    path: '/random',
    options: {
      headers,
    },
  });

  return await res.json();
};

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

  it('returns loading when one results is loading', async () => {
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
  let page;

  beforeEach(() => {
    fetch.resetMocks();
    page = setupPage();
  });

  it('returns data', async () => {
    const body = { data: '12345' };

    mockResponses({
      '/random': { body },
    });

    const { result, waitForNextUpdate } = renderHookWithWrapper(() =>
      useAuthenticatedQuery({
        queryKey: ['random'],
        queryFn,
      }),
    );

    await waitForNextUpdate();

    expect(result.current.data).toStrictEqual(body);
  });
  it('fails on response not ok', async () => {
    const title = 'This is an error';

    mockResponses({
      '/random': { body: { title }, status: 400 },
    });

    const { result, waitForNextUpdate } = renderHookWithWrapper(() =>
      useAuthenticatedQuery({
        retry: false, // disable retry, otherwise the waitFor times out
        queryKey: ['random'],
        queryFn,
      }),
    );

    await waitForNextUpdate();

    expect(result.current.error.message).toStrictEqual(title);
  });

  it('redirects on 401', async () => {
    mockResponses({
      '/random': { status: 401 },
    });

    const { waitForNextUpdate } = renderHookWithWrapper(() =>
      useAuthenticatedQuery({
        retry: false, // disable retry, otherwise the waitFor times out
        queryKey: ['random'],
        queryFn,
      }),
    );

    await waitForNextUpdate();
    expect(page.router.push).toBeCalledWith('/login');
  });

  it('redirects on 403', async () => {
    mockResponses({
      '/random': { status: 403 },
    });

    const { waitForNextUpdate } = renderHookWithWrapper(() =>
      useAuthenticatedQuery({
        retry: false, // disable retry, otherwise the waitFor times out
        queryKey: ['random'],
        queryFn,
      }),
    );

    await waitForNextUpdate();
    expect(page.router.push).toBeCalledWith('/login');
  });
});
