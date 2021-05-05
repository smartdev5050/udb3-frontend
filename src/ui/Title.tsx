import type { BoxProps } from './Box';
import { Box, getBoxProps } from './Box';

const getFontWeight = (props) => {
  if (props.size === 1) return 300;
  return 700;
};

const getFontSize = (props) => {
  if (props.size === 1) return 1.6;
  return 1.2;
};

type TitleProps = BoxProps;

const Title = ({ size, children, className, ...props }: TitleProps) => {
  return (
    <Box
      forwardedAs={`h${size}`}
      size={size}
      className={className}
      css={`
        font-weight: ${getFontWeight};
        font-size: ${getFontSize}rem;
      `}
      {...getBoxProps(props)}
    >
      {children}
    </Box>
  );
};

Title.defaultProps = {
  size: 2,
};

export { Title };
export type { TitleProps };
