import '../styles/global.scss';
import PropTypes from 'prop-types';

import { Inline } from '../components/publiq-ui/Inline';

import { SideBar } from '../components/SideBar';
import { ThemeProvider } from '../components/publiq-ui/ThemeProvider';

import { useRouter } from 'next/router';
import NextHead from 'next/head';
import { ContextProvider } from '../provider/ContextProvider';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { CookiesProvider, Cookies } from 'react-cookie';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';

import { useEffect } from 'react';
import { useCookiesWithOptions } from '../hooks/useCookiesWithOptions';
import { useGetUser } from '../hooks/api/user';
import {
  useHandleWindowMessage,
  WindowMessageTypes,
} from '../hooks/useHandleWindowMessage';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { GlobalStyle } from '../styles/GlobalStyle';
import { isTokenValid } from '../utils/isTokenValid';
import { ErrorBoundary } from '../components/ErrorBoundary';

config.autoAddCss = false;

const useChangeLanguage = () => {
  const { i18n } = useTranslation();
  const { cookies } = useCookiesWithOptions(['udb-language']);
  useEffect(() => {
    i18n.changeLanguage(cookies['udb-language']);
  }, [cookies['udb-language']]);
};

const useHandleAuthentication = () => {
  const { query, asPath, ...router } = useRouter();
  const { setCookie } = useCookiesWithOptions(['user', 'token']);
  const { data: user } = useGetUser();

  useEffect(() => {
    if (query?.jwt) {
      setCookie('token', query.jwt);
    }
  }, [query]);

  useEffect(() => {
    if (!user) return;
    setCookie('user', user);
  }, [user]);

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

const ApplicationLayout = ({ children }) => {
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
      <SideBar />
      {children}
    </Inline>
  );
};

ApplicationLayout.propTypes = {
  children: PropTypes.node,
};

const Layout = ({ children }) => {
  const { asPath } = useRouter();

  if (asPath.startsWith('/login') || asPath.startsWith('/404'))
    return <>{children}</>;
  return (
    <ErrorBoundary>
      <ApplicationLayout>{children}</ApplicationLayout>
    </ErrorBoundary>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

const Head = () => (
  <NextHead>
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
    <title key="title">UitDatabank</title>
  </NextHead>
);

const queryClient = new QueryClient();

const isServer = () => typeof window === 'undefined';

const App = ({ Component, pageProps }) => {
  return (
    <>
      <GlobalStyle />
      <Head />
      <ContextProvider
        providers={[
          [I18nextProvider, { i18n }],
          ThemeProvider,
          [
            CookiesProvider,
            {
              cookies: isServer() ? new Cookies(pageProps.cookies) : undefined,
            },
          ],
          [QueryClientProvider, { client: queryClient }],
          [Hydrate, { state: pageProps.dehydratedState }],
        ]}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ContextProvider>
    </>
  );
};

App.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  pageProps: PropTypes.object,
};

export default App;
