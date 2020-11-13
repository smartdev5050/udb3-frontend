import '../styles/global.scss';

import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { ThemeProvider } from '../components/publiq-ui/ThemeProvider';
import { CookiesProvider } from 'react-cookie';

// eslint-disable-next-line react/prop-types
const App = ({ Component, pageProps }) => {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <CookiesProvider>
          <Component {...pageProps} />
        </CookiesProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
};

export default App;
