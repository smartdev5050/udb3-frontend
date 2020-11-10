import PropTypes from 'prop-types';
import { Alert as BootstrapAlert } from 'react-bootstrap';
import { getValueFromTheme } from './theme';
import { getBoxProps, boxPropTypes, Box } from './Box';

const AlertVariants = {
  INFO: 'info',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
};

const getValue = getValueFromTheme(`alert`);

const Alert = ({
  variant,
  visible,
  dismissible,
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
      {...getBoxProps(props)}
      css={`
        margin: 0;
        &.alert {
          border-radius: ${getValue('borderRadius')};
        }
      `}
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
  children: PropTypes.node,
};

Alert.defaultProps = {
  variant: AlertVariants.INFO,
  visible: false,
  dismissible: false,
};

export { AlertVariants, Alert };
