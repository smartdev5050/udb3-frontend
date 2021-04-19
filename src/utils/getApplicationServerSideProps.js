import Cookies from 'universal-cookie';
import { QueryClient } from 'react-query';
import { isTokenValid } from './isTokenValid';
import getConfig from 'next/config';

const getApplicationServerSideProps = (callbackFn) => async ({
  req,
  query,
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

    return {
      redirect: {
        destination: '/login',
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
