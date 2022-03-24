import { css } from 'styled-components';

import type { Values } from '@/types/Values';
import { getValueFromTheme } from '@/ui/theme';

import type { InlineProps } from './Inline';
import { getInlineProps, Inline } from './Inline';
import { Text } from './Text';

const getValue = getValueFromTheme('title');

const TitleVariants = {
  DEFAULT: 'default',
  UNDERLINED: 'underlined',
} as const;

const getFontWeight = (props) => {
  if (props.size === 1) return 300;
  return 700;
};

const getFontSize = (props) => {
  if (props.size === 1) return 1.6;
  if (props.size === 2) return 1.2;
  return 1;
};

const getBorderBottom = (props) => {
  if (props.variant === TitleVariants.UNDERLINED) {
    return css`
      border-bottom: 1px solid ${getValue('borderColor')};
    `;
  }

  return css``;
};

type TitleProps = InlineProps & {
  variant?: Values<typeof TitleVariants>;
};

const Title = ({
  size,
  variant,
  children,
  className,
  ...props
}: TitleProps) => {
  return (
    <Inline
      forwardedAs={`h${size}`}
      size={size}
      variant={variant}
      className={className}
      css={`
        font-weight: ${getFontWeight};
        font-size: ${getFontSize}rem;
        ${getBorderBottom}
      `}
      {...getInlineProps(props)}
    >
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </Inline>
  );
};

Title.defaultProps = {
  size: 2,
  variant: TitleVariants.DEFAULT,
};

export { Title, TitleVariants };
export type { TitleProps };
