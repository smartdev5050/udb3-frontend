import { fetchWithRedirect } from '../../utils/fetchWithRedirect';
import { useAuthenticatedQuery } from './authenticated-query';

const getUser = async ({ headers }) => {
  const res = await fetchWithRedirect(
    `${process.env.NEXT_PUBLIC_API_URL}/user`,
    {
      headers,
    },
  );
  return await res.json();
};

const useGetUser = (configuration = {}) =>
  useAuthenticatedQuery({
    queryKey: ['user'],
    queryFn: getUser,
    ...configuration,
  });

const getPermissions = async ({ headers }) => {
  const res = await fetchWithRedirect(
    `${process.env.NEXT_PUBLIC_API_URL}/user/permissions/`,
    {
      headers,
    },
  );
  return await res.json();
};

const useGetPermissions = (configuration = {}) =>
  useAuthenticatedQuery({
    queryKey: ['user', 'permissions'],
    queryFn: getPermissions,
    ...configuration,
  });

const getRoles = async ({ headers }) => {
  const res = await fetchWithRedirect(
    `${process.env.NEXT_PUBLIC_API_URL}/user/roles/`,
    {
      headers,
    },
  );
  return await res.json();
};

const useGetRoles = (configuration = {}) =>
  useAuthenticatedQuery({
    queryKey: ['user', 'roles'],
    queryFn: getRoles,
    ...configuration,
  });

export { useGetUser, useGetPermissions, useGetRoles };
