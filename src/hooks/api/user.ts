import {
  ErrorObject,
  FetchError,
  fetchFromApi,
  isErrorObject,
} from '@/utils/fetchFromApi';

import {
  ServerSideQueryOptions,
  useAuthenticatedQuery,
} from './authenticated-query';

const tryToFetch = async (promise: () => Promise<ErrorObject | Response>) => {
  let res: ErrorObject | Response;

  try {
    res = await promise();
    if (isErrorObject(res)) {
      // eslint-disable-next-line no-console
      return console.error(res);
    }
    return await res.json();
  } catch (error) {
    const status = error?.message === 'Failed to fetch' ? 401 : res?.status;
    throw new FetchError(status, error?.message ?? 'Unknown error');
  }
};

const getUser = async ({ headers }) => {
  return tryToFetch(
    async () =>
      await fetchFromApi({
        path: '/user',
        options: {
          headers,
        },
      }),
  );
};

const useGetUserQuery = (
  { req, queryClient }: ServerSideQueryOptions = {},
  configuration = {},
) => {
  return useAuthenticatedQuery({
    req,
    queryClient,
    queryKey: ['user'],
    queryFn: getUser,
    ...configuration,
  });
};

const getPermissions = async ({ headers }) => {
  return tryToFetch(
    async () =>
      await fetchFromApi({
        path: '/user/permissions/',
        options: {
          headers,
        },
      }),
  );
};

const useGetPermissionsQuery = (configuration = {}) =>
  useAuthenticatedQuery({
    queryKey: ['user', 'permissions'],
    queryFn: getPermissions,
    ...configuration,
  });

const getRoles = async ({ headers }) => {
  return tryToFetch(
    async () =>
      await fetchFromApi({
        path: '/user/roles/',
        options: {
          headers,
        },
      }),
  );
};

const useGetRolesQuery = (configuration = {}) =>
  useAuthenticatedQuery({
    queryKey: ['user', 'roles'],
    queryFn: getRoles,
    ...configuration,
  });

export { useGetPermissionsQuery, useGetRolesQuery, useGetUserQuery };
