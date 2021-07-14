import type { InlineProps } from './Inline';
import { getInlineProps, Inline } from './Inline';

const getFontWeight = (props) => {
  if (props.size === 1) return 300;
  return 700;
};

const getFontSize = (props) => {
  if (props.size === 1) return 1.6;
  return 1.2;
};

type TitleProps = InlineProps;

const Title = ({ size, children, className, ...props }: TitleProps) => {
  return (
    <Inline
      forwardedAs={`h${size}`}
      size={size}
      className={className}
      css={`
        font-weight: ${getFontWeight};
        font-size: ${getFontSize}rem;
      `}
      {...getInlineProps(props)}
    >
      {children}
    </Inline>
  );
};

Title.defaultProps = {
  size: 2,
};

export { Title };
export type { TitleProps };
