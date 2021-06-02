import * as Sentry from '@sentry/nextjs';
import getConfig from 'next/config';
import absoluteUrl from 'next-absolute-url';
import { QueryClient } from 'react-query';
import Cookies from 'universal-cookie';

import { isTokenValid } from './isTokenValid';

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
    Sentry.setUser(null);
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

  if (!callbackFn) return { props: { cookies: rawCookies } };
  return await callbackFn({
    req,
    query,
    queryClient,
    cookies: rawCookies,
  });
};

export { getApplicationServerSideProps };
