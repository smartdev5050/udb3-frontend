import PropTypes from 'prop-types';
import { Alert as BootstrapAlert } from 'react-bootstrap';
import styled from 'styled-components';
import { getValueFromTheme } from './theme';
import { getBoxProps, boxProps, boxPropTypes } from './Box';

const AlertVariants = {
  INFO: 'info',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
};

const getValue = getValueFromTheme(`alert`);

const StyledBootstrapAlert = styled(BootstrapAlert)`
  margin: 0;

  &.alert {
    border-radius: ${getValue('borderRadius')};
  }

  ${boxProps};
`;

const Alert = ({
  variant,
  visible,
  dismissible,
  children,
  className,
  ...props
}) => {
  return (
    <StyledBootstrapAlert
      variant={variant}
      hidden={!visible}
      dismissible={dismissible}
      className={className}
      {...getBoxProps(props)}
    >
      {children}
    </StyledBootstrapAlert>
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
