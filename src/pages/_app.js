import '../styles/global.scss';

import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

import PropTypes from 'prop-types';

import { ThemeProvider } from '../components/publiq-ui/ThemeProvider';
import { CookiesProvider } from 'react-cookie';
import { Inline } from '../components/publiq-ui/Inline';
import { SideBar } from '../components/SideBar';
import { Box } from '../components/publiq-ui/Box';

import { useRouter } from 'next/router';

const Layout = ({ children }) => {
  const { pathname } = useRouter();

  if (pathname.startsWith('/login')) return <>{children}</>;

  return (
    <Inline>
      <SideBar />
      <Box
        css={`
          flex: 1;
          height: 100vh;
          overflow-x: hidden;
          overflow-y: auto;
        `}
      >
        {children}
      </Box>
    </Inline>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

// eslint-disable-next-line react/prop-types
const App = ({ Component, pageProps }) => {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <CookiesProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </CookiesProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
};

export default App;
