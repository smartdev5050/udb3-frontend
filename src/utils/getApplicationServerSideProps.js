import getConfig from 'next/config';
import absoluteUrl from 'next-absolute-url';
import { QueryClient } from 'react-query';
import { generatePath, matchPath } from 'react-router';
import UniversalCookies from 'universal-cookie';

import { useGetUser } from '@/hooks/api/user';
import { isFeatureFlagEnabledInCookies } from '@/hooks/useFeatureFlag';

import { getRedirects } from '../redirects';
import { isTokenValid } from './isTokenValid';

class Cookies extends UniversalCookies {
  toString() {
    const cookieEntries = Object.entries(this.getAll({ doNotParse: true }));

    return cookieEntries.reduce((previous, [key, value], currentIndex) => {
      const end = currentIndex !== cookieEntries.length - 1 ? '; ' : '';
      const pair = `${key}=${encodeURIComponent(value)}${end}`;
      return `${previous}${pair}`;
    }, '');
  }
}

const getRedirect = (originalPath, environment, cookies) => {
  return getRedirects(environment).find(
    ({ source, destination, permanent, featureFlag }) => {
      // Don't follow redirects that are behind a feature flag
      if (featureFlag && !isFeatureFlagEnabledInCookies(featureFlag, cookies)) {
        return false;
      }

      // remove token from originalPath
      const originalPathUrl = new URL(`http://localhost:3000${originalPath}`);
      const params = new URLSearchParams(originalPathUrl.search);

      params.delete('jwt');

      originalPathUrl.search = params.toString();

      // Check if the redirect source matches the current path
      const match = matchPath(
        `${originalPathUrl.pathname}${originalPathUrl.search}`,
        {
          path: source,
          exact: true,
        },
      );

      if (match) {
        return {
          destination: generatePath(destination, match.params),
          permanent: featureFlag === undefined && permanent,
        };
      }
      return false;
    },
  );
};

const getApplicationServerSideProps = (callbackFn) => async ({
  req,
  query,
  resolvedUrl,
}) => {
  const { publicRuntimeConfig } = getConfig();
  if (publicRuntimeConfig.environment === 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
  }

  const rawCookies = req?.headers?.cookie ?? '';

  const cookies = new Cookies(rawCookies);

  if (!isTokenValid(query?.jwt ?? cookies.get('token'))) {
    cookies.remove('user');
    cookies.remove('token');

    const { origin } = absoluteUrl(req);

    const referer = encodeURIComponent(`${origin}${resolvedUrl}`);

    return {
      redirect: {
        destination: `/login?referer=${referer}`,
        permanent: false,
      },
    };
  }

  // set token in req.headers.cookie so that the token is known when prefetching a request
  if (query.jwt && cookies.get('token') !== query.jwt) {
    cookies.set('token', query.jwt);    
  }  

  req.headers.cookie = cookies.toString();

  const isDynamicUrl = !!query.params;
  const path = isDynamicUrl ? ['/', ...query.params].join('/') : req.url;

  const redirect = getRedirect(
    path,
    publicRuntimeConfig.environment,
    cookies.getAll(),
  );

  if (redirect) {
    // Don't include the `params` in the redirect URL's query.
    delete query.params;
    const queryParameters = new URLSearchParams(query);

    // Return the redirect as-is if there are no additional query parameters
    // to append.
    if (!queryParameters.has('jwt')) {
      return { redirect };
    }

    // Append query parameters to the redirect destination.
    const glue = redirect.destination.includes('?') ? '&' : '?';
    const redirectUrl = `${
      redirect.destination
    }${glue}jwt=${queryParameters.get('jwt')}`;
    return { redirect: { ...redirect, destination: redirectUrl } };
  }

  const queryClient = new QueryClient();

  const user = await useGetUser({ req, queryClient });

  if (user) {
    cookies.set('user', user);
  }

  if (!callbackFn) return { props: { cookies: cookies.toString() } };

  return await callbackFn({
    req,
    query,
    queryClient,
    cookies: cookies.toString(),
  });
};

export { getApplicationServerSideProps };
