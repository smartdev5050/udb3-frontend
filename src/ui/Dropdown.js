import {
  Dropdown as BootstrapDropdown,
  ButtonGroup as BootstrapButtonGroup,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { ButtonVariants } from '@/ui/Button';
import { Children } from 'react';
import { Box } from '@/ui/Box';

const DropDownVariants = ButtonVariants;

const BootstrapDropdownAsButtonGroup = ({ children }) => (
  <BootstrapDropdown as={BootstrapButtonGroup}>{children}</BootstrapDropdown>
);

BootstrapDropdownAsButtonGroup.propTypes = {
  children: PropTypes.node,
};

const Dropdown = ({ variant, children }) => {
  const isMenuChild = (child) =>
    child.type === Dropdown.Item || child.type === Dropdown.Divider;
  const menuChildren = Children.toArray(children).filter(isMenuChild);

  return (
    <Box as={BootstrapDropdownAsButtonGroup}>
      <BootstrapDropdown.Toggle split variant={variant} />
      <BootstrapDropdown.Menu>{menuChildren}</BootstrapDropdown.Menu>
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
