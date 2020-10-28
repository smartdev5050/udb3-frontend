import PropTypes from 'prop-types';
import { Button as BootstrapButton } from 'react-bootstrap';
import styled from 'styled-components';
import { getValueFromTheme } from './getValueFromTheme';

const ButtonVariants = {
  PRIMARY: 'primary',
  SECONDARY: 'outline-secondary',
  SUCCESS: 'success',
  DANGER: 'danger',
};

const getValue = (path) => (props) =>
  getValueFromTheme(props, `components.button.${path}`);

const StyledBootstrapButton = styled(BootstrapButton)`
  &.btn {
    border-radius: ${getValue('borderRadius')};
    padding: ${getValue('paddingY')} ${getValue('paddingX')};
  }

  &.btn-primary {
    color: ${getValue('primary.color')};
    background-color: ${getValue('primary.backgroundColor')};

    &:hover {
      background-color: ${getValue('primary.hoverBackgroundColor')};
      border-color: ${getValue('primary.hoverBorderColor')};
    }

    // active
    &.btn-primary:not(:disabled):not(.disabled):active,
    .btn-primary:not(:disabled):not(.disabled).active,
    .show > .btn-primary.dropdown-toggle {
      background-color: ${getValue('primary.activeBackgroundColor')};
      border-color: ${getValue('primary.activeBorderColor')};
    }
  }

  &.btn-outline-secondary {
    color: ${getValue('secondary.color')};
    background-color: ${getValue('secondary.backgroundColor')};

    &:hover {
      background-color: #e6e6e6;
      border-color: #adadad;
    }
  }
`;

const Button = ({ variant, disabled, loading, children }) => {
  // TODO: Add loading spinner when loading is true
  return (
    <StyledBootstrapButton variant={variant} disabled={disabled}>
      {children}
    </StyledBootstrapButton>
  );
};

Button.propTypes = {
  variant: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  children: PropTypes.node,
};

Button.defaultProps = {
  variant: ButtonVariants.PRIMARY,
  disabled: false,
  loading: false,
};

export { ButtonVariants, Button };
