import PropTypes from 'prop-types';
import { Button as BootstrapButton } from 'react-bootstrap';
import { css } from 'styled-components';
import { getValueFromTheme } from './theme';
import { Spinner, SpinnerVariants, SpinnerSizes } from './Spinner';
import { getInlineProps, Inline, inlinePropTypes } from './Inline';
import { Icon } from './Icon';
import { cloneElement } from 'react';

const ButtonVariants = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  DANGER: 'danger',
  UNSTYLED: 'unstyled',
};

const getValue = getValueFromTheme('button');

const BaseButton = (props) => <Inline forwardedAs="button" {...props} />;

const customCSS = css`
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

    &:hover {
      background-color: ${getValue('success.hoverBackgroundColor')};
      border-color: ${getValue('success.hoverBorderColor')};
    }

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

    &:hover {
      background-color: ${getValue('danger.hoverBackgroundColor')};
      border-color: ${getValue('danger.hoverBorderColor')};
    }

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
`;

const Button = ({
  iconName,
  suffix,
  variant,
  disabled,
  loading,
  children,
  onClick,
  className,
  ...props
}) => {
  if (variant === ButtonVariants.SECONDARY) variant = 'outline-secondary';

  const isBootstrapVariant = variant !== ButtonVariants.UNSTYLED;

  const propsToApply = {
    ...(isBootstrapVariant ? { forwardedAs: BaseButton, variant } : {}),
    disabled,
    onClick,
    className,
    ...getInlineProps(props),
  };

  const clonedSuffix = suffix
    ? cloneElement(suffix, {
        ...suffix.props,
        css: `align-self: flex-end`,
        key: 'suffix',
      })
    : undefined;

  const inner = loading ? (
    <Spinner
      className="button-spinner"
      variant={SpinnerVariants.LIGHT}
      size={SpinnerSizes.SMALL}
    />
  ) : (
    [iconName && <Icon name={iconName} key="icon" />, children, clonedSuffix]
  );

  if (isBootstrapVariant) {
    return (
      <BootstrapButton {...propsToApply} css={customCSS}>
        {inner}
      </BootstrapButton>
    );
  }

  return (
    <BaseButton
      {...propsToApply}
      color="inherit"
      cursor="pointer"
      css={`
        background: none;
        border: none;
      `}
      spacing={3}
      alignItems="center"
      justifyContent="flex-start"
    >
      {inner}
    </BaseButton>
  );
};

Button.propTypes = {
  ...inlinePropTypes,
  iconName: PropTypes.string,
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
