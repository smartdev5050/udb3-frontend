import getConfig from 'next/config';

import { User } from '@/types/User';
import { fetchFromApi, isErrorObject } from '@/utils/fetchFromApi';

import {
  ServerSideQueryOptions,
  useAuthenticatedQuery,
} from './authenticated-query';

type Auth0User = {
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
  const url = new URL(
    'https://' + getConfig().publicRuntimeConfig.auth0Domain + '/userinfo',
  );
  const res = await fetch(url, {
    headers,
  });
  if (!res.ok) {
    // eslint-disable-next-line no-console
    return console.error(res);
  }
  return (await res.json()) as Auth0User;
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
export type { Auth0User };
