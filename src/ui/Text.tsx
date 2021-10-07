import type { BoxProps } from './Box';
import { Box, getBoxProps } from './Box';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme('text');

const TextVariants = {
  REGULAR: 'regular',
  MUTED: 'muted',
  ERROR: 'error',
};

type Props = BoxProps;

const getColor = (variant) => {
  if (variant === TextVariants.MUTED) return getValue('muted.color');
  if (variant === TextVariants.ERROR) return getValue('error.color');
};

const Text = ({ as, children, className, variant, ...props }: Props) => {
  return (
    <Box
      as={as}
      className={className}
      color={getColor(variant)}
      {...getBoxProps(props)}
    >
      {children}
    </Box>
  );
};

Text.defaultProps = {
  as: 'span',
  variant: TextVariants.REGULAR,
};

export { Text, TextVariants };
export type { Props as TextProps };
