import '../styles/global.scss';

import PropTypes from 'prop-types';

import { Inline } from '../components/publiq-ui/Inline';
import { SideBar } from '../components/SideBar';
import { Box } from '../components/publiq-ui/Box';

import { useRouter } from 'next/router';
import { ContextProvider } from '../provider/ContextProvider';

const Layout = ({ children }) => {
  const { pathname } = useRouter();
  if (pathname.startsWith('/login')) return children;

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
    <ContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ContextProvider>
  );
};

export default App;
