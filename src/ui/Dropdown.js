import {
  Dropdown as BootstrapDropdown,
  ButtonGroup as BootstrapButtonGroup,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Button, buttonCSS, ButtonVariants } from '@/ui/Button';
import { Link } from '@/ui/Link';
import { Children } from 'react';
import { Box } from '@/ui/Box';
import { getValueFromTheme } from '@/ui/theme';

const getValue = getValueFromTheme(`dropdown`);

const DropDownVariants = ButtonVariants;

const Dropdown = ({ variant, children }) => {
  if (variant === DropDownVariants.SECONDARY) variant = 'outline-secondary';

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
    >
      <BootstrapDropdown as={BootstrapButtonGroup}>
        {primaryActionChildren}
        <BootstrapDropdown.Toggle split variant={variant} css={buttonCSS} />
        <BootstrapDropdown.Menu>{menuChildren}</BootstrapDropdown.Menu>
      </BootstrapDropdown>
    </Box>
  );
};

Dropdown.propTypes = {
  variant: PropTypes.string,
  children: PropTypes.node,
};

const Item = ({ href, onClick, children }) => (
  <BootstrapDropdown.Item href={href} onClick={onClick}>
    {children}
  </BootstrapDropdown.Item>
);

Item.propTypes = {
  href: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
};

const Divider = () => <BootstrapDropdown.Divider />;

Dropdown.Item = Item;
Dropdown.Divider = Divider;

export { Dropdown, DropDownVariants };
