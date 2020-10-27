import PropTypes from 'prop-types';
import { Alert as BootstrapAlert } from 'react-bootstrap';

const AlertVariants = {
  INFO: 'info',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
};

const Alert = ({ variant, visible, dismissible, children }) => (
  <BootstrapAlert variant={variant} hidden={!visible} dismissible={dismissible}>
    {children}
  </BootstrapAlert>
);

Alert.propTypes = {
  variant: PropTypes.string,
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
