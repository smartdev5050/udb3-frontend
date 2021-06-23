import type { Values } from '@/types/Values';

import type { BoxProps } from './Box';
import { Box, getBoxProps } from './Box';

const LabelVariants = {
  BOLD: 'bold',
  NORMAL: 'normal',
} as const;

const getFontWeight = (props) => {
  if (props.variant === LabelVariants.BOLD) return 700;
  return 'normal';
};

type Props = BoxProps & {
  htmlFor: string;
  variant?: Values<typeof LabelVariants>;
};

const Label = ({ htmlFor, children, className, variant, ...props }: Props) => (
  <Box
    forwardedAs="label"
    htmlFor={htmlFor}
    className={className}
    variant={variant}
    css={`
      font-weight: ${getFontWeight};
    `}
    {...getBoxProps(props)}
  >
    {children}
  </Box>
);

Label.defaultProps = {
  variant: LabelVariants.NORMAL,
};

export { Label, LabelVariants };
