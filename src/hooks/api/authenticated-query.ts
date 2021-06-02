import flatten from 'lodash/flatten';
import type { NextApiRequest } from 'next';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { Cookies } from 'react-cookie';
import type { QueryClient } from 'react-query';
import { useMutation, useQueries, useQuery } from 'react-query';

import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import { isTokenValid } from '@/utils/isTokenValid';

import { createHeaders, useHeaders } from './useHeaders';

type ServerSideQueryOptions = {
  req?: NextApiRequest;
  queryClient?: QueryClient;
};

const QueryStatus = {
  IDLE: 'idle',
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
};

const prepareKey = ({ queryKey, queryArguments }) => {
  const key = Array.isArray(queryKey) ? queryKey : [queryKey];
  return [
    ...flatten(key),
    Object.keys(queryArguments ?? {}).length > 0 ? queryArguments : undefined,
  ].filter((key) => key !== undefined);
};

const prepareArguments = ({
  options: {
    queryKey,
    queryFn,
    queryArguments,
    enabled = true,
    req,
    queryClient,
    ...configuration
  },
  isTokenPresent = false,
  headers,
}) => {
  const parsedQueryKey = prepareKey({ queryArguments, queryKey });

  return {
    queryKey: parsedQueryKey,
    queryFn: async () =>
      await queryFn({ ...queryArguments, headers, queryKey: parsedQueryKey }),
    enabled: isTokenPresent && !!enabled,
    ...configuration,
  };
};

const isUnAuthorized = (status: number) => [401, 403].includes(status);

const getStatusFromResults = (results) => {
  if (results.some(({ status }) => status === QueryStatus.ERROR)) {
    return {
      status: QueryStatus.ERROR,
      error: results
        .map(({ error }) => error)
        .filter((error) => error !== undefined),
    };
  }

  if (results.every(({ status }) => status === QueryStatus.SUCCESS)) {
    return { status: QueryStatus.SUCCESS };
  }
  if (results.some(({ status }) => status === QueryStatus.LOADING)) {
    return { status: QueryStatus.LOADING };
  }
  if (results.some(({ status }) => status === QueryStatus.IDLE)) {
    return { status: QueryStatus.IDLE };
  }
};

const prefetchAuthenticatedQueries = async ({
  req,
  queryClient,
  options: rawOptions = [],
}) => {
  const cookies = new Cookies(req?.headers?.cookie);
  const headers = createHeaders(cookies.get('token'));

  const preparedArguments = rawOptions.map((options) =>
    prepareArguments({
      options,
      isTokenPresent: isTokenValid(cookies.get('token')),
      headers,
    }),
  );

  await Promise.all(
    preparedArguments.map(({ queryKey, queryFn }) =>
      queryClient.prefetchQuery(queryKey, queryFn),
    ),
  );

  return await Promise.all(
    preparedArguments.map(({ queryKey }) => queryClient.getQueryData(queryKey)),
  );
};

const prefetchAuthenticatedQuery = async ({ req, queryClient, ...options }) => {
  const cookies = new Cookies(req?.headers?.cookie);
  const headers = createHeaders(cookies.get('token'));

  const { queryKey, queryFn } = prepareArguments({
    // @ts-expect-error
    options,
    isTokenPresent: isTokenValid(cookies.get('token')),
    headers,
  });

  try {
    await queryClient.prefetchQuery(queryKey, queryFn);
  } catch {}

  return await queryClient.getQueryData(queryKey);
};

/// /////////////////////////////////////////////////////////////////////////////////////////////

const useAuthenticatedMutation = ({ mutationFn, ...configuration }) => {
  const router = useRouter();
  const headers = useHeaders();

  const { removeAuthenticationCookies } = useCookiesWithOptions();

  const innerMutationFn = useCallback(async (variables) => {
    const response = await mutationFn({ ...variables, headers });

    if (isUnAuthorized(response?.status)) {
      removeAuthenticationCookies();
      router
        .push('/login')
        .then(() => {})
        .catch(() => {});
    }

    const result = await response.text();

    if (!result) {
      return '';
    }
    return JSON.parse(result);
  }, []);

  return useMutation(innerMutationFn, configuration);
};

const useAuthenticatedMutations = ({
  mutationFns = [],
  ...configuration
} = {}) => {
  const router = useRouter();
  const headers = useHeaders();

  const { removeAuthenticationCookies } = useCookiesWithOptions();

  const innerMutationFn = useCallback(async (variables) => {
    // @ts-expect-error
    const responses = await mutationFns({ ...variables, headers });

    if (responses.some((response) => isUnAuthorized(response.status))) {
      removeAuthenticationCookies();
      router
        .push('/login')
        .then(() => {})
        .catch(() => {});
    } else if (responses.some((response) => response.type === 'ERROR')) {
      const errorMessages = responses
        .filter((response) => response.type === 'ERROR')
        .map((response) => response.title)
        .join(', ');
      throw new Error(errorMessages);
    }

    return Promise.all(
      responses.map(async (response) => {
        const result = await response.text();

        if (!result) {
          return '';
        }

        return JSON.parse(result);
      }),
    );
  }, []);

  return useMutation(innerMutationFn, configuration);
};

const useAuthenticatedQuery = (options) => {
  if (!!options.req && !!options.queryClient && typeof window === 'undefined') {
    return prefetchAuthenticatedQuery(options);
  }

  const { asPath, ...router } = useRouter();

  const headers = useHeaders();
  const { cookies, removeAuthenticationCookies } = useCookiesWithOptions([
    'token',
  ]);

  const preparedArguments = prepareArguments({
    options,
    isTokenPresent: isTokenValid(cookies.token),
    headers,
  });

  const result = useQuery(preparedArguments);

  // @ts-expect-error
  if (isUnAuthorized(result?.error?.status)) {
    if (!asPath.startsWith('/login') && asPath !== '/[...params]') {
      removeAuthenticationCookies();
      router
        .push('/login')
        .then(() => {})
        .catch(() => {});
    }
  }

  return result;
};

const useAuthenticatedQueries = ({
  req,
  queryClient,
  options: rawOptions = [],
}) => {
  if (!!req && !!queryClient && typeof window === 'undefined') {
    return prefetchAuthenticatedQueries({
      req,
      queryClient,
      options: rawOptions,
    });
  }

  const { asPath, ...router } = useRouter();

  const headers = useHeaders();
  const { cookies, removeAuthenticationCookies } = useCookiesWithOptions([
    'token',
  ]);

  const options = rawOptions.map((options) =>
    prepareArguments({
      options,
      isTokenPresent: isTokenValid(cookies.token),
      headers,
    }),
  );

  const results = useQueries(options);

  // @ts-expect-error
  if (results.some((result) => isUnAuthorized(result?.error?.status))) {
    if (!asPath.startsWith('/login') && asPath !== '/[...params]') {
      removeAuthenticationCookies();
      router
        .push('/login')
        .then(() => {})
        .catch(() => {});
    }
  }

  return {
    data: results.map(({ data }) => data).filter((data) => data !== undefined),
    ...getStatusFromResults(results),
  };
};

export {
  getStatusFromResults,
  QueryStatus,
  useAuthenticatedMutation,
  useAuthenticatedMutations,
  useAuthenticatedQueries,
  useAuthenticatedQuery,
};

export type { ServerSideQueryOptions };
