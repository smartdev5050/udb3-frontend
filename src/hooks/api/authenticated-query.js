import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { Cookies } from 'react-cookie';
import { useQuery, useQueries, useMutation } from 'react-query';
import { Errors } from '../../utils/fetchFromApi';
import { useCookiesWithOptions } from '../useCookiesWithOptions';
import { createHeaders, useHeaders } from './useHeaders';

const QueryStatus = {
  IDLE: 'idle',
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
};

const prepareKey = ({ queryKey, queryArguments }) =>
  [
    ...queryKey,
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
} = {}) => {
  return {
    queryKey: prepareKey({ queryArguments, queryKey }),
    queryFn: () => queryFn({ ...queryArguments, headers }),
    enabled: isTokenPresent && !!enabled,
    ...configuration,
  };
};

const isUnAuthorized = (result) =>
  result.status === 'error' && result.error.message === Errors.UNAUTHORIZED;

const getStatusFromResults = (results) => {
  if (results.some(({ status }) => status === QueryStatus.ERROR)) {
    return {
      status: QueryStatus.ERROR,
      error: results
        .map(({ error }) => error)
        .filter((error) => error !== undefined),
    };
  }
  if (results.every(({ status }) => status === QueryStatus.IDLE)) {
    return { status: QueryStatus.IDLE };
  }
  if (results.every(({ status }) => status === QueryStatus.SUCCESS)) {
    return { status: QueryStatus.SUCCESS };
  }
  if (results.some(({ status }) => status === QueryStatus.LOADING)) {
    return { status: QueryStatus.LOADING };
  }
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
    const result = await mutationFn({ ...variables, headers });

    if (isUnAuthorized(result)) {
      removeAuthenticationCookies();
      router.push('/login');
    } else if (result.status) {
      throw new Error(result.title);
    }

    return result;
  });

  return useMutation(innerMutationFn, configuration);
};

const useAuthenticatedQuery = (options) => {
  const { asPath, ...router } = useRouter();

  const headers = useHeaders();
  const { cookies, removeAuthenticationCookies } = useCookiesWithOptions([
    'token',
  ]);

  const preparedArguments = prepareArguments({
    options,
    isTokenPresent: !!cookies.token,
    headers,
  });

  const result = useQuery(preparedArguments);

  if (isUnAuthorized(result)) {
    if (!asPath.startsWith('/login') && asPath !== '/[...params]') {
      removeAuthenticationCookies();
      router.push('/login');
    }
  }

  return result;
};

const prefetchAuthenticatedQuery = async ({ req, queryClient, ...options }) => {
  const cookies = new Cookies(req?.headers?.cookie);
  const headers = createHeaders(cookies.get('token'));

  const { queryKey, queryFn } = prepareArguments({
    options,
    isTokenPresent: cookies.get('token'),
    headers,
  });

  await queryClient.prefetchQuery(queryKey, queryFn);
  const data = await queryClient.getQueryData();
  return data;
};

const useAuthenticatedQueries = (rawOptions = []) => {
  const { asPath, ...router } = useRouter();

  const headers = useHeaders();
  const { cookies, removeAuthenticationCookies } = useCookiesWithOptions([
    'token',
  ]);

  const options = rawOptions.map((options) =>
    prepareArguments({
      options,
      isTokenPresent: !!cookies.token,
      headers,
    }),
  );

  const results = useQueries(options);

  if (results.some(isUnAuthorized)) {
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
  QueryStatus,
  prepareKey,
  prefetchAuthenticatedQuery,
};
