import { fetchWithRedirect } from '../../utils/fetchWithRedirect';
import { useAuthenticatedQuery } from './useAuthenticatedQuery';

const getMe = async (key, { headers }) => {
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
    queryFunction: getMe,
    configuration,
  });

const getPermissions = async (key, { headers }) => {
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
    queryFunction: getPermissions,
    configuration,
  });

const getRoles = async (key, { headers }) => {
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
    queryFunction: getRoles,
    configuration,
  });

export { useGetUser, useGetPermissions, useGetRoles };
