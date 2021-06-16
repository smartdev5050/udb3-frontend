import getConfig from 'next/config';
import absoluteUrl from 'next-absolute-url';
import { QueryClient } from 'react-query';
import { generatePath, matchPath } from 'react-router';
import { getRedirects } from 'redirects';
import Cookies from 'universal-cookie';

import { isFeatureFlagEnabledInCookies } from '@/hooks/useFeatureFlag';

import { isTokenValid } from './isTokenValid';

const getRedirect = (originalPath, environment, cookies) => {
  return getRedirects(environment)
    .map(({ source, destination, permanent, featureFlag }) => {
      // Don't follow redirects that are behind a feature flag
      if (featureFlag && !isFeatureFlagEnabledInCookies(featureFlag, cookies)) {
        return false;
      }

      // Check if the redirect source matches the current path
      const match = matchPath(originalPath, { path: source, exact: true });
      if (match) {
        return {
          destination: generatePath(destination, match.params),
          permanent: featureFlag === undefined && permanent,
        };
      }
      return false;
    })
    .find((match) => !!match);
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

    const referer = `${origin}${resolvedUrl}`;

    return {
      redirect: {
        destination: `/login?referer=${referer}`,
        permanent: false,
      },
    };
  }

  const queryClient = new QueryClient();

  const params = query.params ?? [];
  const path = '/' + params.join('/');

  console.log({ query, path });

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
    if (queryParameters.toString().length === 0) {
      return { redirect };
    }

    // Append query parameters to the redirect destination.
    const glue = redirect.destination.includes('?') ? '&' : '?';
    const redirectUrl =
      redirect.destination + glue + queryParameters.toString();
    return { redirect: { ...redirect, destination: redirectUrl } };
  }

  if (!callbackFn) return { props: { cookies: rawCookies } };
  return await callbackFn({
    req,
    query,
    queryClient,
    cookies: rawCookies,
  });
};

export { getApplicationServerSideProps };
