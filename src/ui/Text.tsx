import type { BoxProps } from './Box';
import { Box, getBoxProps } from './Box';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme('text');

const TextVariants = {
  REGULAR: 'regular',
  MUTED: 'muted',
};

type Props = BoxProps;

const Text = ({ as, children, className, variant, ...props }: Props) => {
  return (
    <Box
      as={as}
      className={className}
      color={variant === TextVariants.MUTED && getValue('muted.color')}
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
