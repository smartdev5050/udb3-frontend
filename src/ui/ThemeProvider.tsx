import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { theme } from './theme';
import type { Theme } from './theme';

const ThemeProvider = (props: { theme: Theme }) => {
  return <SCThemeProvider theme={theme} {...props} />;
};

export { ThemeProvider };
