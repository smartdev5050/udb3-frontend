import '@/styles/global.scss';

import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/index';

import { ThemeProvider } from '@/ui/ThemeProvider';
import { GlobalStyle } from '@/styles/GlobalStyle';
import { CustomCanvas } from './CustomCanvas';

export const parameters = {
  options: {
    storySort: {
      method: 'alphabetical',
      order: ['Introduction', 'Primitives', 'Components'],
    },
  },
  actions: { argTypesRegex: '^on.*' },
  docs: {
    components: {
      Canvas: CustomCanvas,
    },
  },
};

export const decorators = [
  (Story) => (
    <>
      <GlobalStyle />
      <ThemeProvider>
        <I18nextProvider i18n={i18n}>
          <Story />
        </I18nextProvider>
      </ThemeProvider>
    </>
  ),
];
