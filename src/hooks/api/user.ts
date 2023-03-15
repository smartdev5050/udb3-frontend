import { User } from '@/types/User';
import { fetchFromApi, isErrorObject } from '@/utils/fetchFromApi';

import {
  ServerSideQueryOptions,
  useAuthenticatedQuery,
} from './authenticated-query';

const getUser = async ({ headers }) => {
  const res = await fetchFromApi({
    path: '/user',
    options: {
      headers,
    },
  });
  if (isErrorObject(res)) {
    // eslint-disable-next-line no-console
    return console.error(res);
  }
  return await res.json();
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
  const res = await fetchFromApi({
    path: '/user/permissions/',
    options: {
      headers,
    },
  });
  if (isErrorObject(res)) {
    // eslint-disable-next-line no-console
    return console.error(res);
  }
  return await res.json();
};

const useGetPermissionsQuery = (configuration = {}) =>
  useAuthenticatedQuery({
    queryKey: ['user', 'permissions'],
    queryFn: getPermissions,
    ...configuration,
  });

const getRoles = async ({ headers }) => {
  const res = await fetchFromApi({
    path: '/user/roles/',
    options: {
      headers,
    },
  });
  if (isErrorObject(res)) {
    // eslint-disable-next-line no-console
    return console.error(res);
  }
  return await res.json();
};

const useGetRolesQuery = (configuration = {}) =>
  useAuthenticatedQuery({
    queryKey: ['user', 'roles'],
    queryFn: getRoles,
    ...configuration,
  });

export { useGetPermissionsQuery, useGetRolesQuery, useGetUserQuery };
