import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { theme } from './theme';

const ThemeProvider = (props) => {
  return <SCThemeProvider theme={theme} {...props} />;
};

export { ThemeProvider };
