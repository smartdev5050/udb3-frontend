import { fetchWithRedirect } from '../../utils/fetchWithRedirect';
import { useCookiesWithOptions } from '../useCookiesWithOptions';
import { useAuthenticatedQuery } from './useAuthenticatedQuery';
import { useHeaders } from './useHeaders';

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
  const [cookies] = useCookiesWithOptions(['token']);
  const headers = useHeaders();
  return useAuthenticatedQuery('getUser', () => getMe(headers), {
    enabled: cookies.token,
    ...config,
  });
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
  const [cookies] = useCookiesWithOptions(['token']);
  const headers = useHeaders();
  return useAuthenticatedQuery(
    'getPermissions',
    () => getPermissions(headers),
    {
      enabled: cookies.token,
      ...config,
    },
  );
};

const getRoles = async (headers) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/roles/`, {
    headers,
  });
  return await res.json();
};

const useGetRoles = (config = {}) => {
  const [cookies] = useCookiesWithOptions(['token']);
  const headers = useHeaders();
  return useAuthenticatedQuery('getRoles', () => getRoles(headers), {
    enabled: cookies.token,
    ...config,
  });
};

export { useGetUser, useGetPermissions, useGetRoles };
