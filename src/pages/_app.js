import '../styles/global.scss';
import PropTypes from 'prop-types';

import { Inline } from '../components/publiq-ui/Inline';
// import { ReactQueryDevtools } from 'react-query-devtools';

import { SideBar } from '../components/SideBar';
import { ThemeProvider } from '../components/publiq-ui/ThemeProvider';

import { useRouter } from 'next/router';
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
      if (!cookies.get('token') || !cookies.get('user')) {
        router.push('/login');
      }
    }, 5000); // checking every 5 seconds
    return cleanUp;
  }, [asPath]);
};

const LoginLayout = ({ children }) => {
  useChangeLanguage();
  return children;
};

LoginLayout.propTypes = {
  children: PropTypes.node,
};

const ApplicationLayout = ({ children }) => {
  const { asPath, ...router } = useRouter();
  const { cookies } = useCookiesWithOptions(['token']);

  useChangeLanguage();
  useHandleWindowMessage({
    [WindowMessageTypes.URL_CHANGED]: ({ path }) => router.push(path),
    [WindowMessageTypes.URL_UNKNOWN]: () => router.push('/404'),
    [WindowMessageTypes.HTTP_ERROR_CODE]: ({ code }) => {
      if ([401, 403].includes(code)) {
        router.push('/login');
      }
    },
  });
  useHandleAuthentication();

  if (!cookies.token) return null;

  return (
    <Inline>
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

  if (asPath.startsWith('/login')) return <LoginLayout>{children}</LoginLayout>;
  if (asPath.startsWith('/404')) return children;
  return <ApplicationLayout>{children}</ApplicationLayout>;
};

Layout.propTypes = {
  children: PropTypes.node,
};

const queryClient = new QueryClient();

const isServer = () => typeof window === 'undefined';

const App = ({ Component, pageProps }) => {
  return (
    <>
      <GlobalStyle />
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
        {/* <ReactQueryDevtools initialIsOpen={false} position="bottom-right" /> */}
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
