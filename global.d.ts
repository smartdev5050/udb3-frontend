import type { CSSProp } from 'styled-components';

import type { Theme } from '@/ui/theme';

declare module 'react' {
  interface Attributes {
    css?: CSSProp<Theme>;
    forwardedAs?: string | ComponentType<any>;
  }
}

declare global {
  interface Window {
    clipboardData: DataTransfer;
  }
}
