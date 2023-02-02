import type { CSSProp } from 'styled-components';

import type { Theme } from '@/ui/theme';

declare module 'react' {
  interface Attributes {
    css?: CSSProp<Theme>;
  }
}

declare module 'yup' {
  interface ArraySchema<T> {
    uniqueName(): this;
  }
}

declare global {
  interface Window {
    clipboardData: DataTransfer;
  }
}
