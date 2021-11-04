import type { ReactNode } from 'react';
import { cloneElement } from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';
import { css } from 'styled-components';

import type { Values } from '@/types/Values';

import type { Icons } from './Icon';
import { Icon } from './Icon';
import type { InlineProps } from './Inline';
import { getInlineProps, Inline } from './Inline';
import { Link } from './Link';
import { Spinner, SpinnerSizes, SpinnerVariants } from './Spinner';
import { Text } from './Text';
import { getValueFromTheme } from './theme';

const BootStrapVariants = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  DANGER: 'danger',
} as const;

const ButtonVariants = {
  ...BootStrapVariants,
  UNSTYLED: 'unstyled',
  LINK: 'link',
} as const;

const ButtonSizes = {
  SMALL: 'sm',
  LARGE: 'lg',
} as const;

const getValue = getValueFromTheme('button');

const BaseButton = (props: Omit<InlineProps, 'size'>) => (
  <Inline as="button" {...props} />
);

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
      box-shadow: none;
    }
  }

  &.btn-primary,
  &.btn-primary.dropdown-toggle {
    color: ${getValue('primary.color')};
    background-color: ${getValue('primary.backgroundColor')};
    border-color: ${getValue('primary.borderColor')};

    &:hover {
      background-color: ${getValue('primary.hoverBackgroundColor')};
      border-color: ${getValue('primary.hoverBorderColor')};
    }

    // active
    &.btn-primary:not(:disabled):not(.disabled):active,
    .btn-primary:not(:disabled):not(.disabled).active {
      background-color: ${getValue('primary.activeBackgroundColor')};
      border-color: ${getValue('primary.activeBorderColor')};
      box-shadow: ${getValue('primary.activeBoxShadow')};
    }

    &:focus,
    &.focus {
      box-shadow: ${getValue('primary.focusBoxShadow')};
    }
  }

  &.btn-outline-secondary,
  &.btn-outline-secondary.dropdown-toggle {
    color: ${getValue('secondary.color')};
    background-color: ${getValue('secondary.backgroundColor')};
    border-color: ${getValue('secondary.borderColor')};

    &:hover {
      background-color: ${getValue('secondary.hoverBackgroundColor')};
      border-color: ${getValue('secondary.hoverBorderColor')};
    }

    // active
    &.btn-outline-secondary:not(:disabled):not(.disabled):active,
    .btn-outline-secondary:not(:disabled):not(.disabled).active {
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

  &.btn-success,
  &.btn-success.dropdown-toggle {
    color: ${getValue('success.color')};
    border-color: ${getValue('success.borderColor')};
    background-color: ${getValue('success.backgroundColor')};

    &:hover {
      background-color: ${getValue('success.hoverBackgroundColor')};
      border-color: ${getValue('success.hoverBorderColor')};
    }

    // active & focus
    &:not(:disabled):not(.disabled):active:focus,
    &:not(:disabled):not(.disabled).active:focus {
      box-shadow: ${getValue('success.activeBoxShadow')};
    }

    &:focus,
    &.focus {
      box-shadow: ${getValue('success.focusBoxShadow')};
    }
  }

  &.btn-danger,
  &.btn-danger.dropdown-toggle {
    color: ${getValue('danger.color')};
    border-color: ${getValue('danger.borderColor')};
    background-color: ${getValue('danger.backgroundColor')};

    &:hover {
      background-color: ${getValue('danger.hoverBackgroundColor')};
      border-color: ${getValue('danger.hoverBorderColor')};
    }

    // active & focus
    &:not(:disabled):not(.disabled):active:focus,
    &:not(:disabled):not(.disabled).active:focus {
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

type ButtonProps = Omit<InlineProps, 'size'> & {
  iconName?: Values<typeof Icons>;
  suffix?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  customChildren?: boolean;
  shouldHideText?: boolean;
  size?: Values<typeof ButtonSizes>;
  variant?: Values<typeof ButtonVariants>;
  type?: string;
};

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
  type,
  ...props
}: ButtonProps) => {
  const isBootstrapVariant = (Object.values(
    BootStrapVariants,
  ) as string[]).includes(variant);
  const isLinkVariant = variant === ButtonVariants.LINK;

  // @ts-expect-error
  if (variant === ButtonVariants.SECONDARY) variant = 'outline-secondary';

  const BaseButtonWithForwardedAs = (props) => (
    <BaseButton {...props} forwardedAs={forwardedAs} />
  );

  const forwardedButton = forwardedAs ? BaseButtonWithForwardedAs : BaseButton;
  const bootstrapProps = isBootstrapVariant
    ? { forwardedAs: forwardedButton, variant }
    : {};

  const propsToApply = {
    ...bootstrapProps,
    disabled,
    onClick,
    className,
    title,
    size,
    type,
    ...getInlineProps(props),
  };

  const clonedSuffix = suffix
    ? // @ts-expect-error
      cloneElement(suffix, {
        // @ts-expect-error
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

  if (isLinkVariant) {
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
            box-shadow: none;
          }
        `}
        alignItems="center"
        justifyContent="flex-start"
      >
        <Link as="span" href="">
          {children}
        </Link>
      </BaseButton>
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
          box-shadow: none;
        }
      `}
      alignItems="center"
      justifyContent="flex-start"
    >
      {inner}
    </BaseButton>
  );
};

Button.defaultProps = {
  variant: ButtonVariants.PRIMARY,
  disabled: false,
  loading: false,
  customChildren: false,
  shouldHideText: false,
  textAlign: 'center',
  type: 'button',
};

export { Button, customCSS as buttonCSS, ButtonSizes, ButtonVariants };
