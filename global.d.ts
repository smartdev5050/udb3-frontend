import type { CSSProp } from 'styled-components';

import type { Theme } from '@/ui/theme';
import { AnySchema } from 'yup/lib/schema';
import Lazy from 'yup/lib/Lazy';
import { AnyObject, Maybe } from 'yup/lib/types';
import { TypeOf } from 'yup/lib/util/types';

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
