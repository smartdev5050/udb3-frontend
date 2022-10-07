import type { MouseEvent, ReactNode } from 'react';
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
};

const Dropdown = ({ variant, children, ...props }: DropdownProps) => {
  const isMenuChild = (child) =>
    child.type === Dropdown.Item || child.type === Dropdown.Divider;
  const menuChildren = Children.toArray(children).filter(isMenuChild);

  const isPrimaryActionChild = (child) =>
    child.type === Button || child.type === Link;
  const primaryActionChildren = Children.toArray(children).filter(
    isPrimaryActionChild,
  );

  return (
    <Box
      css={`
        .dropdown-menu {
          border-radius: ${getValue('menuBorderRadius')};
        }
      `}
      {...getBoxProps(props)}
    >
      <BootstrapDropdown
        // @ts-expect-error
        forwardedAs={BootstrapButtonGroup}
        css={`
          & {
            box-shadow: -4px 6px 21px 3px rgb(210 210 210 / 80%);
          }

          > * {
            box-shadow: none;
          }

          &:first-element {
            border-top-right: 0;
            box-shadow: none;
            border-bottom-right: 0;
            border-right: 1px solid gray;
          }

          &.btn:not(:first-element) {
            flex: 1;
            border: none;
            box-shadow: none;
            border-radius: 0;
          }

          .btn:not(:first-element) {
            flex: 1;
            border: none;
            box-shadow: none;
            border-radius: 0;
          }
        `}
      >
        {primaryActionChildren}
        {menuChildren.length > 0 && (
          <>
            <BootstrapDropdown.Toggle split variant={variant} css={buttonCSS} />
            <BootstrapDropdown.Menu>{menuChildren}</BootstrapDropdown.Menu>
          </>
        )}
      </BootstrapDropdown>
    </Box>
  );
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
        forwardedAs={Button}
        variant={ButtonVariants.SECONDARY}
        onClick={onClick}
        css={`
          &.btn {
            flex: 1;
            border: none;
            box-shadow: none;
            border-radius: 0;
          }
        `}
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
            box-shadow: none;
            border-radius: 0;
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
