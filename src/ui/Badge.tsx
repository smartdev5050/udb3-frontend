import { Badge as BootstrapBadge } from 'react-bootstrap';
import { css } from 'styled-components';

import type { Values } from '@/types/Values';

import type { BoxProps } from './Box';
import { getBoxProps } from './Box';
import { Text } from './Text';

const BadgeVariants = {
  DANGER: 'danger',
  SECONDARY: 'secondary',
} as const;

const BaseBadge = (props: BoxProps) => <Text {...props} />;

type Props = BoxProps & {
  variant?: Values<typeof BadgeVariants>;
};

const Badge = ({ children, className, variant, ...props }: Props) => {
  return (
    <BootstrapBadge
      as={BaseBadge}
      className={className}
      variant={variant}
      lineHeight="inherit"
      height="min-content"
      {...getBoxProps(props)}
    >
      {children}
    </BootstrapBadge>
  );
};

Badge.defaultProps = {
  variant: BadgeVariants.DANGER,
};

export { Badge, BadgeVariants };
