import PropTypes from 'prop-types';
import { Alert as BootstrapAlert } from 'react-bootstrap';
import styled from 'styled-components';
import { getValueFromTheme } from './getValueFromTheme';

const AlertVariants = {
  INFO: 'info',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
};

const getValue = (path) => (props) =>
  getValueFromTheme(props, `components.alert.${path}`);

const StyledBootstrapAlert = styled(BootstrapAlert)`
  &.alert {
    border-radius: ${getValue('borderRadius')};
  }

  &.alert-info {
    color: ${getValue('info.color')};
    background-color: ${getValue('info.backgroundColor')};
    border-color: ${getValue('info.borderColor')};
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
