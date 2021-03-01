import {
  getStatusFromResults,
  QueryStatus,
  useAuthenticatedQuery,
} from './authenticated-query';

import { renderHook } from '@testing-library/react-hooks';
import { TestApp } from '../../tests/utils/TestApp';
import { queryFn } from '../../tests/utils/queryFn';
import { mockResponses, setupPage } from '../../tests/utils/setupPage';
import { match } from 'path-to-regexp';
import { mockRouterWithParams } from '../../tests/mocks/mockRouterWithParams';

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
  beforeEach(() => {
    fetch.resetMocks();
    setupPage();
  });

  it('returns data', async () => {
    const body = { data: '12345' };

    mockResponses({
      '/random': { body },
    });

    const { result, waitForNextUpdate } = renderHook(
      () =>
        useAuthenticatedQuery({
          queryKey: ['random'],
          queryFn,
        }),
      { wrapper: TestApp },
    );

    await waitForNextUpdate();

    expect(result.current.data).toStrictEqual(body);
  });
  it('fails on response not ok', async () => {
    const title = 'This is an error';

    mockResponses({
      '/random': { body: { title }, status: 400 },
    });

    const { result, waitForNextUpdate } = renderHook(
      () =>
        useAuthenticatedQuery({
          retry: false, // disable retry, otherwise the waitFor times out
          queryKey: ['random'],
          queryFn,
        }),
      { wrapper: TestApp },
    );

    await waitForNextUpdate();

    expect(result.current.error.message).toStrictEqual(title);
  });

  it('redirects on 401', async () => {
    const { push } = mockRouterWithParams();

    mockResponses({
      '/random': { status: 401 },
    });

    const { waitForNextUpdate } = renderHook(
      () =>
        useAuthenticatedQuery({
          retry: false, // disable retry, otherwise the waitFor times out
          queryKey: ['random'],
          queryFn,
        }),
      { wrapper: TestApp },
    );

    await waitForNextUpdate();
    expect(push).toBeCalledWith('/login');
  });

  it('redirects on 403', async () => {
    const { push } = mockRouterWithParams();

    mockResponses({
      '/random': { status: 403 },
    });

    const { waitForNextUpdate } = renderHook(
      () =>
        useAuthenticatedQuery({
          retry: false, // disable retry, otherwise the waitFor times out
          queryKey: ['random'],
          queryFn,
        }),
      { wrapper: TestApp },
    );

    await waitForNextUpdate();
    expect(push).toBeCalledWith('/login');
  });
});
