import { ThemeProvider } from '../src/components/publiq-ui/ThemeProvider';
import '../src/styles/global.scss';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  options: {
    storySort: {
      method: 'alphabetical',
      order: ['Introduction', 'Components'],
    },
  },
};

export const decorators = [
  (Story) => (
    <ThemeProvider>
      <Story />
    </ThemeProvider>
  ),
];
