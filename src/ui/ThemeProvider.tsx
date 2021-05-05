import { ThemeProvider as SCThemeProvider } from 'styled-components';

import type { Theme } from './theme';
import { theme } from './theme';

const ThemeProvider = (props: { theme: Theme }) => {
  return <SCThemeProvider theme={theme} {...props} />;
};

export { ThemeProvider };
