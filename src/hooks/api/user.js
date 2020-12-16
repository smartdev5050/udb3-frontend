import { fetchWithRedirect } from '../../utils/fetchWithRedirect';
import { useAuthenticatedQuery } from './useAuthenticatedQuery';

const getMe = async ({ headers }) => {
  const res = await fetchWithRedirect('/user', {
    headers,
  });
  return await res.json();
};

const useGetUser = (configuration = {}) =>
  useAuthenticatedQuery({
    queryKey: ['user'],
    queryFn: getMe,
    ...configuration,
  });

const getPermissions = async ({ headers }) => {
  const res = await fetchWithRedirect('/user/permissions/', {
    headers,
  });
  return await res.json();
};

const useGetPermissions = (configuration = {}) =>
  useAuthenticatedQuery({
    queryKey: ['user', 'permissions'],
    queryFn: getPermissions,
    ...configuration,
  });

const getRoles = async ({ headers }) => {
  const res = await fetchWithRedirect('/user/roles/', {
    headers,
  });
  return await res.json();
};

const useGetRoles = (configuration = {}) =>
  useAuthenticatedQuery({
    queryKey: ['user', 'roles'],
    queryFn: getRoles,
    ...configuration,
  });

export { useGetUser, useGetPermissions, useGetRoles };
