import jwt_decode from 'jwt-decode';
import getConfig from 'next/config';

import { FetchError, fetchFromApi, isErrorObject } from '@/utils/fetchFromApi';

import { Cookies, useCookiesWithOptions } from '../useCookiesWithOptions';
import {
  ServerSideQueryOptions,
  useAuthenticatedQuery,
} from './authenticated-query';

const { publicRuntimeConfig } = getConfig();

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

const getUser = async (cookies: Cookies) => {
  if (!cookies.idToken) {
    throw new FetchError(401, 'Unauthorized');
  }

  const userInfo = jwt_decode(cookies.idToken);

  return userInfo;
};

const useGetUserQuery = () => {
  const { cookies } = useCookiesWithOptions(['idToken']);

  return useAuthenticatedQuery({
    queryKey: ['user'],
    queryFn: () => getUser(cookies),
    staleTime: Infinity,
  });
};

const useGetUserQueryServerSide = (
  { req, queryClient }: ServerSideQueryOptions = {},
  configuration = {},
) => {
  console.log('in server side');

  const cookies = req.cookies;

  return useAuthenticatedQuery({
    req,
    queryClient,
    queryKey: ['user'],
    queryFn: () => getUser(cookies),
    staleTime: Infinity,
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

export {
  useGetPermissionsQuery,
  useGetRolesQuery,
  useGetUserQuery,
  useGetUserQueryServerSide,
};
export type { User };
