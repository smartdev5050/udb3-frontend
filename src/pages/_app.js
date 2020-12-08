import '../styles/global.scss';

import PropTypes from 'prop-types';

import { Inline } from '../components/publiq-ui/Inline';
import { SideBar } from '../components/SideBar';
import { ThemeProvider } from '../components/publiq-ui/ThemeProvider';

import { useRouter } from 'next/router';
import { ContextProvider } from '../provider/ContextProvider';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { CookiesProvider } from 'react-cookie';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { useEffect } from 'react';
import { useCookiesWithOptions } from '../hooks/useCookiesWithOptions';
import { useGetUser } from '../hooks/api/user';
import {
  useHandleWindowMessage,
  WindowMessageTypes,
} from '../hooks/useHandleWindowMessage';

const queryCache = new QueryCache();

const useChangeLanguage = () => {
  const { i18n } = useTranslation();
  const { cookies } = useCookiesWithOptions(['udb-language']);
  useEffect(() => {
    i18n.changeLanguage(cookies['udb-language']);
  }, [cookies['udb-language']]);
};

const useHandleAuthentication = () => {
  const { asPath, query, ...router } = useRouter();
  const { cookies, setCookie } = useCookiesWithOptions(['user', 'token']);
  const { data: user } = useGetUser();

  useEffect(() => {
    if (asPath.startsWith('/login') || asPath === '/[...params]') return;

    if (!cookies?.token && !query?.jwt) {
      router.push('/login');
    }

    if (query?.jwt) {
      setCookie('token', query.jwt);
    }
  }, [query, asPath, cookies.token]);

  useEffect(() => {
    if (!user) return;
    setCookie('user', user);
  }, [user]);
};

const Layout = ({ children }) => {
  const { asPath, ...router } = useRouter();

  useChangeLanguage();
  useHandleWindowMessage({
    [WindowMessageTypes.URL_CHANGED]: ({ path }) => router.push(path),
  });
  useHandleAuthentication();

  if (asPath.startsWith('/login')) return children;

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

// eslint-disable-next-line react/prop-types
const App = ({ Component, pageProps }) => (
  <ContextProvider
    providers={[
      [I18nextProvider, { i18n }],
      ThemeProvider,
      CookiesProvider,
      [ReactQueryCacheProvider, { queryCache }],
    ]}
  >
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </ContextProvider>
);

export default App;
