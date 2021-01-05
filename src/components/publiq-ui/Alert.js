import PropTypes from 'prop-types';
import { Alert as BootstrapAlert } from 'react-bootstrap';
import { getValueFromTheme } from './theme';
import { getBoxProps, boxPropTypes, Box } from './Box';

const AlertVariants = {
  INFO: 'info',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
  DARK: 'dark',
};

const getValue = getValueFromTheme(`alert`);

const Alert = ({
  variant,
  visible,
  dismissible,
  onDismiss,
  children,
  className,
  ...props
}) => {
  return (
    <BootstrapAlert
      forwardedAs={Box}
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
      {...getBoxProps(props)}
    >
      {children}
    </BootstrapAlert>
  );
};

Alert.propTypes = {
  ...boxPropTypes,
  className: PropTypes.string,
  variant: PropTypes.oneOf(Object.values(AlertVariants)),
  visible: PropTypes.bool,
  dismissible: PropTypes.bool,
  onDismiss: PropTypes.func,
  children: PropTypes.node,
};

Alert.defaultProps = {
  visible: true,
  variant: AlertVariants.INFO,
  dismissible: false,
};

export { AlertVariants, Alert };
