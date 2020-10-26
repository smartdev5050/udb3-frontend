import '../styles/global/globals.scss';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

// eslint-disable-next-line react/prop-types
const App = ({ Component, pageProps }) => (
  <I18nextProvider i18n={i18n}>
    <Component {...pageProps} />
  </I18nextProvider>
);

export default App;
