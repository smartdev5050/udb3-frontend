import getConfig from 'next/config';

import { fetchFromApi, isErrorObject } from '@/utils/fetchFromApi';

import {
  ServerSideQueryOptions,
  useAuthenticatedQuery,
} from './authenticated-query';

type User = {
  sub: string;
  given_name: string;
  family_name: string;
  nickname: string;
  name: string;
  picture: string;
  locale: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
  'https://publiq.be/uitidv1id': string;
  'https://publiq.be/hasMuseumpasSubscription': boolean;
  'https://publiq.be/first_name': string;
};

const getUser = async ({ headers }) => {
  // We can't send all of the headers to auth0.
  // Sending the X-Api-Key header will cause CORS issues
  // Leaking the X-Api-Key to other services than udb3 backend is also not needed
  const filteredHeaders = Object.fromEntries<string>(
    Object.entries<string>(headers).filter(
      ([key]) => key.toLowerCase() !== 'x-api-key',
    ),
  );

  const res = await fetchFromApi({
    apiUrl: `https://${getConfig().publicRuntimeConfig.auth0Domain}`,
    path: '/userinfo',
    options: {
      headers: filteredHeaders,
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
export type { User };
