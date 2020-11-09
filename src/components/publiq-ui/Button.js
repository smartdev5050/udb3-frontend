import PropTypes from 'prop-types';
import { Button as BootstrapButton } from 'react-bootstrap';
import styled from 'styled-components';
import { getValueFromTheme } from './theme';
import { Spinner, SpinnerVariants, SpinnerSizes } from './Spinner';
import { getLayoutProps, spacingProps, spacingPropTypes } from './Box';

const ButtonVariants = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  DANGER: 'danger',
};

const getValue = getValueFromTheme('button');

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

    // active & focus
    &:not(:disabled):not(.disabled):active:focus,
    &:not(:disabled):not(.disabled).active:focus,
    .show > &.dropdown-toggle:focus {
      background-color: ${getValue('primary.activeBackgroundColor')};
      border-color: ${getValue('primary.activeBorderColor')};
      box-shadow: ${getValue('primary.activeBoxShadow')};
    }

    &:focus,
    &.focus {
      box-shadow: ${getValue('primary.focusBoxShadow')};
    }
  }

  &.btn-outline-secondary {
    color: ${getValue('secondary.color')};
    background-color: ${getValue('secondary.backgroundColor')};

    &:hover {
      background-color: ${getValue('secondary.hoverBackgroundColor')};
      border-color: ${getValue('secondary.hoverBorderColor')};
    }

    // active & focus
    &:not(:disabled):not(.disabled):active:focus,
    &:not(:disabled):not(.disabled).active:focus,
    .show > &.dropdown-toggle:focus {
      color: ${getValue('secondary.activeColor')};
      background-color: ${getValue('secondary.activeBackgroundColor')};
      border-color: ${getValue('secondary.activeBorderColor')};
      box-shadow: ${getValue('secondary.activeBoxShadow')};
    }

    &:focus,
    &.focus {
      box-shadow: ${getValue('secondary.focusBoxShadow')};
    }
  }

  &.btn-success {
    color: ${getValue('success.color')};
    border-color: ${getValue('success.borderColor')};
    background-color: ${getValue('success.backgroundColor')};

    // active & focus
    &:not(:disabled):not(.disabled):active:focus,
    &:not(:disabled):not(.disabled).active:focus,
    .show > &.dropdown-toggle:focus {
      box-shadow: ${getValue('success.activeBoxShadow')};
    }

    &:focus,
    &.focus {
      box-shadow: ${getValue('success.focusBoxShadow')};
    }
  }

  &.btn-danger {
    color: ${getValue('danger.color')};
    border-color: ${getValue('danger.borderColor')};
    background-color: ${getValue('danger.backgroundColor')};

    // active & focus
    &:not(:disabled):not(.disabled):active:focus,
    &:not(:disabled):not(.disabled).active:focus,
    .show > &.dropdown-toggle:focus {
      box-shadow: ${getValue('danger.activeBoxShadow')};
    }

    &:focus,
    &.focus {
      box-shadow: ${getValue('danger.focusBoxShadow')};
    }
  }

  .button-spinner {
    height: 1.5rem;
    display: flex;
    align-items: center;
  }

  ${spacingProps}
`;

const Button = ({
  variant,
  disabled,
  loading,
  children,
  onClick,
  className,
  ...props
}) => {
  if (variant === ButtonVariants.SECONDARY) variant = 'outline-secondary';

  const layoutProps = getLayoutProps(props);

  return (
    <StyledBootstrapButton
      variant={variant}
      disabled={disabled}
      onClick={onClick}
      className={className}
      {...layoutProps}
    >
      {loading ? (
        <Spinner
          className="button-spinner"
          variant={SpinnerVariants.LIGHT}
          size={SpinnerSizes.SMALL}
        />
      ) : (
        children
      )}
    </StyledBootstrapButton>
  );
};

Button.propTypes = {
  ...spacingPropTypes,
  className: PropTypes.string,
  variant: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  variant: ButtonVariants.PRIMARY,
  disabled: false,
  loading: false,
  onClick: () => {},
};

export { ButtonVariants, Button };
