import { fetchWithRedirect } from '../../utils/fetchWithRedirect';
import { useAuthenticatedQuery } from './useAuthenticatedQuery';

const getMe = async (headers) => {
  const res = await fetchWithRedirect(
    `${process.env.NEXT_PUBLIC_API_URL}/user`,
    {
      headers,
    },
  );
  return await res.json();
};

const useGetUser = (config = {}) => {
  return useAuthenticatedQuery('getUser', getMe, config);
};

const getPermissions = async (headers) => {
  const res = await fetchWithRedirect(
    `${process.env.NEXT_PUBLIC_API_URL}/user/permissions/`,
    {
      headers,
    },
  );
  return await res.json();
};

const useGetPermissions = (config = {}) => {
  return useAuthenticatedQuery('getPermissions', getPermissions, config);
};

const getRoles = async (headers) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/roles/`, {
    headers,
  });
  return await res.json();
};

const useGetRoles = (config = {}) => {
  return useAuthenticatedQuery('getRoles', getRoles, config);
};

export { useGetUser, useGetPermissions, useGetRoles };
