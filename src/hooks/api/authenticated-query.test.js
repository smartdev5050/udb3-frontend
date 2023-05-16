import { useQueryClient } from 'react-query';

import { renderHookWithWrapper } from '@/test/utils/renderHookWithWrapper';
import { mockResponses, setupPage } from '@/test/utils/setupPage';
import { fetchFromApi } from '@/utils/fetchFromApi';

import {
  getStatusFromResults,
  QueryStatus,
  useAuthenticatedMutation,
  useAuthenticatedQuery,
} from './authenticated-query';

const getCalledMutations = (path) => {
  return fetch.mock.calls.filter((call) => {
    const url = call[0];

    return url.includes(path || '/mutate');
  });
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

const mutationFn = async ({ headers }) => {
  return fetchFromApi({
    path: '/mutate',
    options: {
      method: 'PUT',
      headers,
    },
  });
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

describe('useAuthenticatedMutation', () => {
  let page;

  beforeEach(async () => {
    const { result, waitForNextUpdate } = renderHookWithWrapper(() =>
      useQueryClient(),
    );

    await waitForNextUpdate();

    const queryClient = result.current;

    queryClient.getMutationCache().clear();
    fetch.resetMocks();
    page = setupPage();
  });

  it("doesn't execute the mutation when the mutationKey and variables are the same as previous", async () => {
    mockResponses({
      '/mutate': { status: 204 },
    });

    const { waitForNextUpdate, result } = renderHookWithWrapper(() =>
      useAuthenticatedMutation({
        mutationKey: 'mutate-something',
        mutationFn: mutationFn,
      }),
    );

    await waitForNextUpdate({
      timeout: 3000,
    });

    const mutation = result.current;

    await mutation.mutateAsync({
      test: 'test',
    });

    await mutation.mutateAsync({
      test: 'test',
    });

    const calledMutationsCount = getCalledMutations().length;

    expect(calledMutationsCount).toEqual(1);
  });

  it('does execute the mutation when the mutationKey is different than previous mutations', async () => {
    mockResponses({
      '/mutate': { status: 204 },
    });

    const mutation1Hook = renderHookWithWrapper(() =>
      useAuthenticatedMutation({
        mutationKey: 'mutate-something',
        mutationFn: mutationFn,
      }),
    );

    const mutation2Hook = renderHookWithWrapper(() =>
      useAuthenticatedMutation({
        mutationKey: 'mutate-something-else',
        mutationFn: mutationFn,
      }),
    );

    await mutation1Hook.waitForNextUpdate();
    await mutation2Hook.waitForNextUpdate();

    const mutation1 = mutation1Hook.result.current;
    const mutation2 = mutation2Hook.result.current;

    await mutation1.mutateAsync({
      test: 'test',
    });

    await mutation2.mutateAsync({
      test: 'test',
    });

    const calledMutationsCount = getCalledMutations().length;

    expect(calledMutationsCount).toEqual(2);
  });

  it('does execute the mutation when the mutationKey is the same but variables are different than previous mutations', async () => {
    mockResponses({
      '/mutate': { status: 204 },
    });

    const { result, waitForNextUpdate } = renderHookWithWrapper(() =>
      useAuthenticatedMutation({
        mutationKey: 'mutate-something',
        mutationFn: mutationFn,
      }),
    );

    await waitForNextUpdate();

    const mutation = result.current;

    await mutation.mutateAsync({
      test: 'test',
    });

    await mutation.mutateAsync({
      different: 'different',
    });

    const calledMutationsCount = getCalledMutations().length;

    expect(calledMutationsCount).toEqual(2);
  });

  it('compares the payload with the latest mutation', async () => {
    mockResponses({
      '/mutate': { status: 204 },
    });

    const { result, waitForNextUpdate } = renderHookWithWrapper(() =>
      useAuthenticatedMutation({
        mutationKey: 'mutate-something',
        mutationFn: mutationFn,
      }),
    );

    await waitForNextUpdate();

    const mutation = result.current;

    await mutation.mutateAsync({
      test: 'test',
    });

    await mutation.mutateAsync({
      different: 'different',
    });

    await mutation.mutateAsync({
      test: 'test',
    });

    const calledMutationsCount = getCalledMutations().length;

    expect(calledMutationsCount).toEqual(3);
  });
});
