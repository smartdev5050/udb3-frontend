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

const useGetUser = (config = {}) =>
  useAuthenticatedQuery('user', getMe, config);

const getPermissions = async (key, { headers }) => {
  const res = await fetchWithRedirect(
    `${process.env.NEXT_PUBLIC_API_URL}/user/permissions/`,
    {
      headers,
    },
  );
  return await res.json();
};

const useGetPermissions = (config = {}) =>
  useAuthenticatedQuery('permissions', getPermissions, config);

const getRoles = async (key, { headers }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/roles/`, {
    headers,
  });
  return await res.json();
};

const useGetRoles = (config = {}) =>
  useAuthenticatedQuery('roles', getRoles, config);

export { useGetUser, useGetPermissions, useGetRoles };
