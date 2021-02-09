import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { Cookies } from 'react-cookie';
import { useQuery, useQueries, useMutation } from 'react-query';
import { isTokenValid } from '../../utils/isTokenValid';
import { useCookiesWithOptions } from '../useCookiesWithOptions';
import { createHeaders, useHeaders } from './useHeaders';

const QueryStatus = {
  IDLE: 'idle',
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
};

const prepareKey = ({ queryKey = [], queryArguments = {} } = {}) =>
  [
    ...[queryKey].flat(),
    Object.keys(queryArguments).length > 0 ? queryArguments : undefined,
  ].filter((key) => key !== undefined);

const prepareArguments = ({
  options: {
    queryKey,
    queryFn = () => {},
    queryArguments = {},
    enabled = true,
    ...configuration
  } = {},
  isTokenPresent = false,
  headers,
} = {}) => ({
  queryKey: prepareKey({ queryArguments, queryKey }),
  queryFn: () => queryFn({ ...queryArguments, headers }),
  enabled: isTokenPresent && !!enabled,
  ...configuration,
});

const isUnAuthorized = (status) => [401, 403].includes(status);

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

  const perparedArguments = rawOptions.map((options) =>
    prepareArguments({
      options,
      isTokenPresent: isTokenValid(cookies.get('token')),
      headers,
    }),
  );

  await Promise.all(
    perparedArguments.map(({ queryKey, queryFn }) =>
      queryClient.prefetchQuery(queryKey, queryFn),
    ),
  );

  return await Promise.all(
    perparedArguments.map(({ queryKey }) => queryClient.getQueryData(queryKey)),
  );
};

const prefetchAuthenticatedQuery = async ({ req, queryClient, ...options }) => {
  const cookies = new Cookies(req?.headers?.cookie);
  const headers = createHeaders(cookies.get('token'));

  const { queryKey, queryFn } = prepareArguments({
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

const useAuthenticatedMutation = ({
  mutationFn = () => {},
  ...configuration
} = {}) => {
  const router = useRouter();
  const headers = useHeaders();

  const { removeAuthenticationCookies } = useCookiesWithOptions();

  const innerMutationFn = useCallback(async (variables) => {
    const response = await mutationFn({ ...variables, headers });

    if (isUnAuthorized(response?.status)) {
      removeAuthenticationCookies();
      router.push('/login');
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
    const responses = await mutationFns({ ...variables, headers });

    if (responses.some((response) => isUnAuthorized(response.status))) {
      removeAuthenticationCookies();
      router.push('/login');
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

const useAuthenticatedQuery = ({ ...options } = {}) => {
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

  if (isUnAuthorized(result?.error?.status)) {
    if (!asPath.startsWith('/login') && asPath !== '/[...params]') {
      removeAuthenticationCookies();
      router.push('/login');
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

  if (results.some((result) => isUnAuthorized(result?.error?.status))) {
    if (!asPath.startsWith('/login') && asPath !== '/[...params]') {
      removeAuthenticationCookies();
      router.push('/login');
    }
  }

  return {
    data: results.map(({ data }) => data).filter((data) => data !== undefined),
    ...getStatusFromResults(results),
  };
};

export {
  useAuthenticatedQuery,
  useAuthenticatedQueries,
  useAuthenticatedMutation,
  useAuthenticatedMutations,
  getStatusFromResults,
  QueryStatus,
};
