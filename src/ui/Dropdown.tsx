import { cloneElement, MouseEvent, ReactNode } from 'react';
import { Children } from 'react';
import {
  ButtonGroup as BootstrapButtonGroup,
  Dropdown as BootstrapDropdown,
} from 'react-bootstrap';

import type { Values } from '@/types/Values';
import type { BoxProps } from '@/ui/Box';
import { Box, getBoxProps } from '@/ui/Box';
import { Button, buttonCSS, ButtonVariants } from '@/ui/Button';
import { Link, LinkVariants } from '@/ui/Link';
import { getValueFromTheme } from '@/ui/theme';

const getValue = getValueFromTheme(`dropdown`);

const DropDownVariants = {
  ...ButtonVariants,
  SECONDARY: 'outline-secondary',
} as const;

type DropdownProps = BoxProps & {
  variant: Values<typeof DropDownVariants>;
  isSplit?: boolean;
};

const Dropdown = ({
  variant,
  isSplit,
  children,
  className,
  ...props
}: DropdownProps) => {
  const isMenuChild = (child) =>
    child.type === Dropdown.Item || child.type === Dropdown.Divider;
  const menuChildren = Children.toArray(children).filter(isMenuChild);

  const isPrimaryActionChild = (child) =>
    child.type === Button || child.type === Link;
  const primaryActionChild = Children.toArray(children).find(
    isPrimaryActionChild,
  );

  const buttonVariant =
    variant === DropDownVariants.SECONDARY ? ButtonVariants.SECONDARY : variant;

  const primaryAction = cloneElement(
    // @ts-expect-error
    primaryActionChild,
    {
      // @ts-expect-error
      ...primaryActionChild.props,
      variant: buttonVariant,
    },
  );

  return (
    <Box
      css={`
        .dropdown-menu {
          border-radius: ${getValue('menuBorderRadius')};
        }

        .show > .dropdown-toggle,
        .show > .dropdown-toggle:focus:not(:focus-visible),
        .show > .dropdown-toggle.focus:not(:focus-visible) {
          box-shadow: ${getValue('activeToggleBoxShadow')};
        }
      `}
      className={className}
      {...getBoxProps(props)}
    >
      <BootstrapDropdown as={BootstrapButtonGroup}>
        {isSplit ? (
          primaryAction
        ) : (
          <BootstrapDropdown.Toggle variant={variant} css={buttonCSS}>
            {/* @ts-expect-error */}
            {primaryActionChild.props.children}
          </BootstrapDropdown.Toggle>
        )}
        {menuChildren.length > 0 && (
          <>
            {isSplit && (
              <BootstrapDropdown.Toggle
                split
                variant={variant}
                css={buttonCSS}
              />
            )}
            <BootstrapDropdown.Menu>{menuChildren}</BootstrapDropdown.Menu>
          </>
        )}
      </BootstrapDropdown>
    </Box>
  );
};

Dropdown.defaultProps = {
  isSplit: false,
};

type ItemProps = {
  href?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  children: ReactNode;
};

const Item = ({ href, onClick, children }: ItemProps) => {
  if (onClick) {
    return (
      <BootstrapDropdown.Item
        as={Button}
        variant={ButtonVariants.SECONDARY}
        onClick={onClick}
      >
        {children}
      </BootstrapDropdown.Item>
    );
  }

  if (href) {
    return (
      <BootstrapDropdown.Item
        forwardedAs={Link}
        variant={LinkVariants.BUTTON_SECONDARY}
        href={href}
        padding={0}
        css={`
          .btn {
            flex: 1;
            border: none;
          }
        `}
      >
        {children}
      </BootstrapDropdown.Item>
    );
  }

  return null;
};

const Divider = BootstrapDropdown.Divider;

Dropdown.Item = Item;
Dropdown.Divider = Divider;

export { Dropdown, DropDownVariants };
