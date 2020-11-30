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
