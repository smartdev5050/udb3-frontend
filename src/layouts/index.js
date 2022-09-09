import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Cookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';

import { useGetTermsQuery } from '@/hooks/api/terms';
import { useGetUserQuery } from '@/hooks/api/user';
import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import {
  useHandleWindowMessage,
  WindowMessageTypes,
} from '@/hooks/useHandleWindowMessage';
import { Inline } from '@/ui/Inline';
import { isTokenValid } from '@/utils/isTokenValid';

import { ErrorBoundary } from './ErrorBoundary';
import { Sidebar } from './Sidebar';

const useChangeLanguage = () => {
  const { i18n } = useTranslation();
  const { cookies } = useCookiesWithOptions(['udb-language']);
  useEffect(() => {
    i18n.changeLanguage(cookies['udb-language']);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies['udb-language']]);
};

const useHandleAuthentication = () => {
  const { pathname, query, asPath, ...router } = useRouter();
  const { setCookie, cookies } = useCookiesWithOptions(['user', 'token']);
  const getUserQuery = useGetUserQuery();

  useEffect(() => {
    if (!query?.jwt) return;

    if (cookies.token !== query?.jwt) {
      setCookie('token', query.jwt);
    }

    const { jwt, ...restQuery } = query;

    router.push(
      {
        pathname,
        query: restQuery,
      },
      undefined,
      { shallow: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    if (!getUserQuery.data) return;
    setCookie('user', getUserQuery.data);
    Sentry.setUser({ id: getUserQuery.data.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserQuery.data]);

  // redirect when there is no token or user cookie
  // manipulation from outside the application
  useEffect(() => {
    let intervalId; // eslint-disable-line prefer-const
    const cleanUp = () => (intervalId ? clearInterval(intervalId) : undefined);
    if (asPath.startsWith('/login')) return cleanUp;
    intervalId = setInterval(() => {
      const cookies = new Cookies();
      if (!isTokenValid(cookies.get('token')) || !cookies.get('user')) {
        cookies.remove('user');
        Sentry.setUser(null);
        cookies.remove('token');
        router.push('/login');
      }
    }, 5000); // checking every 5 seconds
    return cleanUp;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath]);
};

const Layout = ({ children }) => {
  const { asPath, ...router } = useRouter();
  const { cookies, removeAuthenticationCookies } = useCookiesWithOptions([
    'token',
  ]);

  useChangeLanguage();
  useHandleWindowMessage({
    [WindowMessageTypes.URL_CHANGED]: ({ path }) => {
      const url = new URL(
        `${window.location.protocol}//${window.location.host}${path}`,
      );
      const query = Object.fromEntries(url.searchParams.entries());
      const hasPage = url.searchParams.has('page');
      if (hasPage) {
        window.history.pushState(
          undefined,
          '',
          `${window.location.protocol}//${window.location.host}${path}`,
        );
      } else {
        if (url.pathname !== '/search') {
          router.push({ pathname: url.pathname, query });
        }
      }
    },
    [WindowMessageTypes.HTTP_ERROR_CODE]: ({ code }) => {
      if ([401, 403].includes(code)) {
        removeAuthenticationCookies();
        router.push('/login');
      }
    },
  });
  useHandleAuthentication();
  useGetTermsQuery();

  if (!cookies.token) return null;

  return (
    <Inline height="100vh">
      <Sidebar />
      {children}
    </Inline>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

const LayoutWrapper = ({ children }) => {
  const { asPath } = useRouter();

  if (
    asPath.startsWith('/login') ||
    asPath.startsWith('/404') ||
    asPath.startsWith('/500')
  ) {
    return <>{children}</>;
  }

  return (
    <ErrorBoundary>
      <Layout>{children}</Layout>
    </ErrorBoundary>
  );
};

LayoutWrapper.propTypes = {
  children: PropTypes.node,
};

export default LayoutWrapper;
