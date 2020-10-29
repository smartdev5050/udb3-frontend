import PropTypes from 'prop-types';
import { Alert as BootstrapAlert } from 'react-bootstrap';
import styled from 'styled-components';

const AlertVariants = {
  INFO: 'info',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
};

const StyledBootstrapAlert = styled(BootstrapAlert)`
  &.alert-info {
    background-color: #d9edf6;
    border-color: #bce8ef;
    color: #3e88ab;
  }
`;

const Alert = ({ variant, visible, dismissible, children }) => (
  <StyledBootstrapAlert
    variant={variant}
    hidden={!visible}
    dismissible={dismissible}
  >
    {children}
  </StyledBootstrapAlert>
);

Alert.propTypes = {
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
