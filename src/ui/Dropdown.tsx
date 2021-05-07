import type { ReactNode } from 'react';
import { Children } from 'react';
import {
  ButtonGroup as BootstrapButtonGroup,
  Dropdown as BootstrapDropdown,
} from 'react-bootstrap';

import type { Values } from '@/types/Values';
import type { BoxProps } from '@/ui/Box';
import { Box, getBoxProps } from '@/ui/Box';
import { Button, buttonCSS, ButtonVariants } from '@/ui/Button';
import { Link } from '@/ui/Link';
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

        .show > .dropdown-toggle,
        .show > .dropdown-toggle:focus:not(:focus-visible),
        .show > .dropdown-toggle.focus:not(:focus-visible) {
          box-shadow: ${getValue('activeToggleBoxShadow')};
        }
      `}
      {...getBoxProps(props)}
    >
      <BootstrapDropdown as={BootstrapButtonGroup}>
        {primaryActionChildren}
        <BootstrapDropdown.Toggle split variant={variant} css={buttonCSS} />
        <BootstrapDropdown.Menu>{menuChildren}</BootstrapDropdown.Menu>
      </BootstrapDropdown>
    </Box>
  );
};

type ItemProps = {
  href?: string;
  onClick?: (...args: unknown[]) => void;
  children: ReactNode;
};

const Item = ({ href, onClick, children }: ItemProps) => (
  <BootstrapDropdown.Item href={href} onClick={onClick}>
    {children}
  </BootstrapDropdown.Item>
);

const Divider = BootstrapDropdown.Divider;

Dropdown.Item = Item;
Dropdown.Divider = Divider;

export { Dropdown, DropDownVariants };
