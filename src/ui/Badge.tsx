import { Badge as BootstrapBadge } from 'react-bootstrap';

import type { Values } from '@/types/Values';

import type { BoxProps } from './Box';
import { getBoxProps } from './Box';
import { Text } from './Text';
import { colors } from './theme';

const BadgeVariants = {
  DANGER: 'danger',
  SECONDARY: 'secondary',
  INFO: 'info',
  UNSTYLED: 'unstyled',
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
      backgroundColor={
        variant === BadgeVariants.INFO
          ? colors.udbMainBlue
          : variant === BadgeVariants.UNSTYLED
          ? 'transparent'
          : undefined
      }
    >
      {children}
    </BootstrapBadge>
  );
};

Badge.defaultProps = {
  variant: BadgeVariants.DANGER,
};

export { Badge, BadgeVariants };
