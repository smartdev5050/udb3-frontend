import PropTypes from 'prop-types';

import { useGetUser } from '@/hooks/api/user';
import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import {
  useHandleWindowMessage,
  WindowMessageTypes,
} from '@/hooks/useHandleWindowMessage';
import { Inline } from '@/ui/Inline';
import { isTokenValid } from '@/utils/isTokenValid';
import { setSentryUser } from '@/utils/sentry';
import { Sidebar } from './Sidebar';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Cookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import { ErrorFallback } from './ErrorFallback';
import * as Sentry from '@sentry/react';

const useChangeLanguage = () => {
  const { i18n } = useTranslation();
  const { cookies } = useCookiesWithOptions(['udb-language']);
  useEffect(() => {
    i18n.changeLanguage(cookies['udb-language']);
  }, [cookies['udb-language']]);
};

const useHandleAuthentication = () => {
  const { query, asPath, ...router } = useRouter();
  const { setCookie, cookies } = useCookiesWithOptions(['user', 'token']);
  const getUserQuery = useGetUser();

  useEffect(() => {
    if (query?.jwt && cookies.token !== query?.jwt) {
      setCookie('token', query.jwt);
    }
  }, [query]);

  useEffect(() => {
    if (!getUserQuery.data) return;
    const { id, email, username } = getUserQuery.data;
    setCookie('user', getUserQuery.data);
    setSentryUser({ id, email, username });
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
        cookies.remove('token');
        router.push('/login');
      }
    }, 5000); // checking every 5 seconds
    return cleanUp;
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
        router.push({ pathname: url.pathname, query });
      }
    },
    [WindowMessageTypes.URL_UNKNOWN]: () => router.push('/404'),
    [WindowMessageTypes.HTTP_ERROR_CODE]: ({ code }) => {
      if ([401, 403].includes(code)) {
        removeAuthenticationCookies();
        router.push('/login');
      }
    },
  });
  useHandleAuthentication();

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

  if (asPath.startsWith('/login') || asPath.startsWith('/404')) {
    return <>{children}</>;
  }

  return (
    // eslint-disable-next-line node/handle-callback-err
    <Sentry.ErrorBoundary
      fallback={({ error }) => <ErrorFallback error={error} />}
    >
      <Layout>{children}</Layout>
    </Sentry.ErrorBoundary>
  );
};

LayoutWrapper.propTypes = {
  children: PropTypes.node,
};

export default LayoutWrapper;
