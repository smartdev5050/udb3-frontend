import { ThemeProvider } from '../src/components/publiq-ui/ThemeProvider';
import '../src/styles/global.scss';
import { CustomCanvas } from './CustomCanvas';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  options: {
    storySort: {
      method: 'alphabetical',
      order: ['Introduction', 'Components'],
    },
  },
  docs: {
    components: {
      Canvas: CustomCanvas,
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
