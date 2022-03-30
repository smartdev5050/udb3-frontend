import { fetchFromApi } from '@/utils/fetchFromApi';

import { useAuthenticatedQuery } from './authenticated-query';

const getUser = async ({ headers }) => {
  const res = await fetchFromApi({
    path: '/user',
    options: {
      headers,
    },
  });
  return await res.json();
};

const useGetUserQuery = ({ req, queryClient } = {}, configuration = {}) =>
  useAuthenticatedQuery({
    req,
    queryClient,
    queryKey: ['user'],
    queryFn: getUser,
    ...configuration,
  });

const getPermissions = async ({ headers }) => {
  const res = await fetchFromApi({
    path: '/user/permissions/',
    options: {
      headers,
    },
  });
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
  return await res.json();
};

const useGetRolesQuery = (configuration = {}) =>
  useAuthenticatedQuery({
    queryKey: ['user', 'roles'],
    queryFn: getRoles,
    ...configuration,
  });

export { useGetPermissionsQuery, useGetRolesQuery, useGetUserQuery };
