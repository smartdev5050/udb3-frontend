import type { Values } from '@/types/Values';

import type { BoxProps } from './Box';
import { Box, getBoxProps } from './Box';
import { Inline } from './Inline';
import { Text } from './Text';

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
  required?: boolean;
};

const Label = ({
  htmlFor,
  children,
  className,
  variant,
  required,
  ...props
}: Props) => (
  <Inline spacing={2} alignItems="center">
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
    {required && <Text color="red">*</Text>}
  </Inline>
);

Label.defaultProps = {
  variant: LabelVariants.NORMAL,
  required: false,
};

export { Label, LabelVariants };
