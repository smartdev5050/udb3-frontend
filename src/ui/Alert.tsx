import { Alert as BootstrapAlert } from 'react-bootstrap';

import type { Values } from '@/types/Values';

import type { BoxProps } from './Box';
import { Box, getBoxProps } from './Box';
import { Icon, Icons } from './Icon';
import { Inline } from './Inline';
import { Text } from './Text';
import { getValueFromTheme } from './theme';

const AlertVariants = {
  PRIMARY: 'primary',
  INFO: 'info',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
  DARK: 'dark',
} as const;

const AlertVariantIconsMap = {
  [AlertVariants.PRIMARY]: [Icons.INFO],
  [AlertVariants.SUCCESS]: [Icons.CHECK_CIRCLE],
  [AlertVariants.WARNING]: [Icons.EXCLAMATION_CIRCLE],
  [AlertVariants.DANGER]: [Icons.EXCLAMATION_TRIANGLE],
};

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
        <Inline spacing={3} alignItems="flex-start">
          <Icon
            name={AlertVariantIconsMap[variant]}
            css={`
              height: 24px;
            `}
          />
          <Text> {children}</Text>
        </Inline>
      </BootstrapAlert>
    </Box>
  );
};

Alert.defaultProps = {
  visible: true,
  variant: AlertVariants.PRIMARY,
  dismissible: false,
};

export { Alert, AlertVariants };
