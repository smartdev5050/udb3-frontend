import { Spinner as BootstrapSpinner } from 'react-bootstrap';

import type { Values } from '@/types/Values';

import type { BoxProps } from './Box';
import { Box, getBoxProps } from './Box';
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
    <Box
      className={className}
      width="100%"
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
      {...getBoxProps(props)}
    >
      <BootstrapSpinner
        animation="border"
        variant={variant}
        size={size}
        css={`
          display: flex;
        `}
      />
    </Box>
  );
};

Spinner.defaultProps = {
  variant: SpinnerVariants.PRIMARY,
};

export { Spinner, SpinnerSizes, SpinnerVariants };
