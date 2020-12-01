import '../styles/global.scss';

import PropTypes from 'prop-types';

import { Inline } from '../components/publiq-ui/Inline';
import { SideBar } from '../components/SideBar';
import { ThemeProvider } from '../components/publiq-ui/ThemeProvider';

import { useRouter } from 'next/router';
import { ContextProvider } from '../provider/ContextProvider';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { CookiesProvider } from 'react-cookie';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { useEffect } from 'react';
import { useCookiesWithOptions } from '../hooks/useCookiesWithOptions';
import { useGetUser } from '../hooks/api/user';

const queryCache = new QueryCache();

const Layout = ({ children }) => {
  const { pathname } = useRouter();

  if (pathname.startsWith('/login')) return <>{children}</>;

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
const App = ({ Component, pageProps }) => {
  const { pathname, query, ...router } = useRouter();
  const [cookies, setCookie] = useCookiesWithOptions(['user']);
  const { data: user } = useGetUser();

  const MESSAGE_SOURCE_UDB = 'UDB';
  const MESSAGE_TYPE_URL_CHANGED = 'URL_CHANGED';

  const handleMessage = (event) => {
    if (event.data.source !== MESSAGE_SOURCE_UDB) {
      return;
    }

    if (event.data.type === MESSAGE_TYPE_URL_CHANGED) {
      router.push(event.data.path);
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (!pathname.startsWith('/login')) {
      if (query?.jwt) {
        setCookie('token', query.jwt);
      }

      if (!cookies?.token) {
        router.push('/login');
      }
    }
  }, [query, pathname]);

  useEffect(() => {
    if (user) {
      setCookie('user', user);
      // TODO: Currently after logging in it returns to the login page again after loading dashboard, this forces to go back to dashboard
      router.push('/dashboard');
    }
  }, [user]);

  return (
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
};

export default App;
