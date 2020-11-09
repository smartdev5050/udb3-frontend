import { pick } from 'lodash';
import PropTypes from 'prop-types';
import { Alert as BootstrapAlert } from 'react-bootstrap';
import styled from 'styled-components';
import { getValueFromTheme } from './theme';
import { spacingProps, spacingPropTypes } from './Box';

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

  ${spacingProps};
`;

const Alert = ({
  variant,
  visible,
  dismissible,
  children,
  className,
  ...props
}) => {
  const layoutProps = pick(props, Object.keys(spacingPropTypes));
  return (
    <StyledBootstrapAlert
      variant={variant}
      hidden={!visible}
      dismissible={dismissible}
      className={className}
      {...layoutProps}
    >
      {children}
    </StyledBootstrapAlert>
  );
};

Alert.propTypes = {
  ...spacingPropTypes,
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
