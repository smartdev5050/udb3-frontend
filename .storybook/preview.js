import { ThemeProvider } from '../src/components/publiq-ui/ThemeProvider';
import '../src/styles/global/globals.scss';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

export const decorators = [
  (Story) => (
    <ThemeProvider>
      <Story />
    </ThemeProvider>
  ),
];
