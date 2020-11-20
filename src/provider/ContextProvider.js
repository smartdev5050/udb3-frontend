import { combineComponents } from './combineComponents';

import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { ThemeProvider } from '../components/publiq-ui/ThemeProvider';
import { CookiesProvider } from 'react-cookie';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';

const queryCache = new QueryCache();

const providers = [
  ({ children }) => I18nextProvider({ children, i18n }),
  ThemeProvider,
  CookiesProvider,
  ({ children }) => ReactQueryCacheProvider({ children, queryCache }),
];

const ContextProvider = combineComponents(...providers);

export { ContextProvider };
