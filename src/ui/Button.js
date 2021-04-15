import PropTypes from 'prop-types';
import { Button as BootstrapButton } from 'react-bootstrap';
import { css } from 'styled-components';
import { getValueFromTheme } from './theme';
import { Spinner, SpinnerVariants, SpinnerSizes } from './Spinner';
import { getInlineProps, Inline, inlinePropTypes } from './Inline';
import { Icon } from './Icon';
import { cloneElement } from 'react';
import { Text } from './Text';

const ButtonVariants = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  DANGER: 'danger',
  UNSTYLED: 'unstyled',
};

const ButtonSizes = {
  MEDIUM: 'md',
  LARGE: 'lg',
};

const getValue = getValueFromTheme('button');

const BaseButton = (props) => <Inline forwardedAs="button" {...props} />;

const customCSS = css`
  &.btn {
    border-radius: ${getValue('borderRadius')};
    padding: ${getValue('paddingY')} ${getValue('paddingX')};
    flex-shrink: 0;

    &:focus,
    &.focus {
      outline: auto;
    }

    &:focus:not(:focus-visible),
    &.focus:not(:focus-visible) {
      outline: none;
    }
  }

  &.btn-primary {
    color: ${getValue('primary.color')};
    background-color: ${getValue('primary.backgroundColor')};
    border-color: ${getValue('primary.borderColor')};

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
    border-color: ${getValue('secondary.borderColor')};

    &:hover {
      background-color: ${getValue('secondary.hoverBackgroundColor')};
      border-color: ${getValue('secondary.hoverBorderColor')};
    }

    // active
    &.btn-outline-secondary:not(:disabled):not(.disabled):active,
    .btn-outline-secondary:not(:disabled):not(.disabled).active,
    .show > .btn-outline-secondary.dropdown-toggle {
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
  customChildren,
  shouldHideText,
  onClick,
  className,
  textAlign,
  title,
  size,
  forwardedAs,
  ...props
}) => {
  if (variant === ButtonVariants.SECONDARY) variant = 'outline-secondary';

  const isBootstrapVariant = variant !== ButtonVariants.UNSTYLED;

  const BaseButtonWithForwardedAs = (props) => (
    <BaseButton {...props} forwardedAs={forwardedAs} />
  );

  const propsToApply = {
    ...(isBootstrapVariant
      ? { forwardedAs: BaseButtonWithForwardedAs, variant }
      : {}),
    disabled,
    onClick,
    className,
    title,
    size,
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
    [
      iconName && <Icon name={iconName} key="icon" />,
      customChildren
        ? children
        : !shouldHideText && (
            <Text flex={1} textAlign="left" key="text">
              {children}
            </Text>
          ),
      clonedSuffix,
    ]
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

        :focus {
          outline: auto;
        }
        :focus:not(:focus-visible) {
          outline: none;
        }
      `}
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
  title: PropTypes.string,
  className: PropTypes.string,
  textAlign: PropTypes.string,
  variant: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  children: PropTypes.node,
  customChildren: PropTypes.bool,
  shouldHideText: PropTypes.bool,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  variant: ButtonVariants.PRIMARY,
  disabled: false,
  loading: false,
  customChildren: false,
  shouldHideText: false,
  textAlign: 'center',
  onClick: () => {},
  size: ButtonSizes.MEDIUM,
};

export { ButtonVariants, Button, ButtonSizes };
