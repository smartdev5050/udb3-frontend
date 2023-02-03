import type { CSSProp } from 'styled-components';

import type { Theme } from '@/ui/theme';

declare module 'react' {
  interface Attributes {
    css?: CSSProp<Theme>;
  }
}

declare global {
  interface Window {
    clipboardData: DataTransfer;
  }
}
