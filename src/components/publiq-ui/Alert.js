import PropTypes from 'prop-types';
import { Alert as BootstrapAlert } from 'react-bootstrap';

const AlertVariants = {
  INFO: 'info',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
};

const Alert = ({ variant, visible, dismissible }) => (
  <BootstrapAlert variant={variant} hidden={!visible} dismissible={dismissible}>
    This is a {variant} alert—check it out!
  </BootstrapAlert>
);

Alert.propTypes = {
  variant: PropTypes.string,
  visible: PropTypes.bool,
  dismissible: PropTypes.bool,
};

Alert.defaultProps = {
  variant: AlertVariants.INFO,
  visible: false,
  dismissible: false,
};

export { AlertVariants };
export default Alert;
