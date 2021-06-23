import { Alert as BootstrapAlert } from 'react-bootstrap';

import type { Values } from '@/types/Values';

import type { BoxProps } from './Box';
import { Box, getBoxProps } from './Box';
import { getValueFromTheme } from './theme';

const AlertVariants = {
  INFO: 'info',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
  DARK: 'dark',
} as const;

const getValue = getValueFromTheme(`alert`);

type Props = BoxProps & {
  variant?: Values<typeof AlertVariants>;
  visible?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
};

const Alert = ({
  variant,
  visible,
  dismissible,
  onDismiss,
  children,
  className,
  ...props
}: Props) => {
  return (
    <Box {...getBoxProps(props)}>
      <BootstrapAlert
        variant={variant}
        hidden={!visible}
        dismissible={dismissible}
        className={className}
        css={`
          margin: 0;
          &.alert {
            border-radius: ${getValue('borderRadius')};
          }
        `}
        onClose={onDismiss}
      >
        {children}
      </BootstrapAlert>
    </Box>
  );
};

Alert.defaultProps = {
  visible: true,
  variant: AlertVariants.INFO,
  dismissible: false,
};

export { Alert, AlertVariants };
