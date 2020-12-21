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
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { useEffect } from 'react';
import { useCookiesWithOptions } from '../hooks/useCookiesWithOptions';
import { useGetUser } from '../hooks/api/user';
import {
  useHandleWindowMessage,
  WindowMessageTypes,
} from '../hooks/useHandleWindowMessage';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false;

const useChangeLanguage = () => {
  const { i18n } = useTranslation();
  const { cookies } = useCookiesWithOptions(['udb-language']);
  useEffect(() => {
    i18n.changeLanguage(cookies['udb-language']);
  }, [cookies['udb-language']]);
};

const useHandleAuthentication = () => {
  const { query } = useRouter();
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
};

const Layout = ({ children }) => {
  const { asPath, ...router } = useRouter();
  const { cookies } = useCookiesWithOptions(['token']);

  useChangeLanguage();
  useHandleWindowMessage({
    [WindowMessageTypes.URL_CHANGED]: ({ path }) => router.push(path),
  });
  useHandleAuthentication();

  if (asPath.startsWith('/login')) return children;
  if (!cookies.token) return null;

  return (
    <Inline>
      <SideBar />
      {children}
    </Inline>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

const queryCache = new QueryCache();
const queryClient = new QueryClient({ queryCache });

const isServer = () => typeof window === 'undefined';

// eslint-disable-next-line react/prop-types
const App = ({ Component, pageProps, cookies }) => {
  return (
    <ContextProvider
      providers={[
        [I18nextProvider, { i18n }],
        ThemeProvider,
        [CookiesProvider, { cookies: isServer() ? cookies : undefined }],
        [QueryClientProvider, { client: queryClient }],
      ]}
    >
      {/* <ReactQueryDevtools initialIsOpen={false} position="bottom-right" /> */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ContextProvider>
  );
};

App.getInitialProps = async (props) => {
  const { asPath, req, query, res } = props.ctx;
  const cookies = new Cookies(req?.headers?.cookie);

  const isUnAuthorized = !cookies.get('token') && !query?.jwt;
  const isOnLogin = asPath.startsWith('/login') || asPath === '/[...params]';

  if (!isOnLogin && isUnAuthorized && isServer()) {
    res.writeHead(302, {
      Location: '/login',
    });
    res.end();
  }

  return { cookies };
};

export default App;
