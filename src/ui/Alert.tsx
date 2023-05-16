import { Alert as BootstrapAlert } from 'react-bootstrap';

import type { Values } from '@/types/Values';

import { Icon, Icons } from './Icon';
import type { InlineProps } from './Inline';
import { getInlineProps, Inline } from './Inline';
import { Text } from './Text';
import { getValueFromTheme } from './theme';
import { parseSpacing } from '@/ui/Box';

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

type AlertProps = InlineProps & {
  variant?: Values<typeof AlertVariants>;
  visible?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  fullWidth?: boolean;
};

const Alert = ({
  variant,
  visible,
  dismissible,
  onDismiss,
  children,
  className,
  fullWidth,
  ...props
}: AlertProps) => {
  return (
    <Inline
      {...getInlineProps(props)}
      alignSelf={fullWidth ? 'normal' : 'flex-start'}
    >
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
          {typeof children !== 'string' ? (
            <Text>{children}</Text>
          ) : (
            <Text
              dangerouslySetInnerHTML={{ __html: children as string }}
              css={`
                strong {
                  font-weight: bold;
                }

                ul {
                  list-style-type: disc;
                  margin-bottom: ${parseSpacing(4)};

                  li {
                    margin-left: ${parseSpacing(5)};
                  }
                }
              `}
            />
          )}
        </Inline>
      </BootstrapAlert>
    </Inline>
  );
};

Alert.defaultProps = {
  visible: true,
  variant: AlertVariants.PRIMARY,
  dismissible: false,
};

export { Alert, AlertProps, AlertVariants };
