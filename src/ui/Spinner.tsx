import { Spinner as BootstrapSpinner } from 'react-bootstrap';

import type { Values } from '@/types/Values';

import type { BoxProps } from './Box';
import { Box } from './Box';
import { getInlineProps, Inline } from './Inline';
import { getValueFromTheme } from './theme';

const SpinnerVariants = {
  PRIMARY: 'primary',
  LIGHT: 'light',
} as const;

const SpinnerSizes = {
  SMALL: 'sm',
} as const;

const getValue = getValueFromTheme('spinner');

type Props = Omit<BoxProps, 'size'> & {
  variant?: Values<typeof SpinnerVariants>;
  size?: Values<typeof SpinnerSizes>;
};

const Spinner = ({ variant, size, className, ...props }: Props) => {
  return (
    <Inline
      forwardedAs="div"
      className={className}
      width="100%"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      css={`
        .text-primary {
          color: ${getValue('primary.color')} !important;
        }
        .text-light {
          color: ${getValue('light.color')} !important;
        }
      `}
      {...getInlineProps(props)}
    >
      <BootstrapSpinner
        as={Box}
        animation="border"
        variant={variant}
        size={size}
      />
    </Inline>
  );
};

Spinner.defaultProps = {
  variant: SpinnerVariants.PRIMARY,
};

export { Spinner, SpinnerSizes, SpinnerVariants };
