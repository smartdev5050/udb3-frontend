import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getBoxProps, boxProps, boxPropTypes } from './Box';

const StyledCheckbox = styled.input.attrs(() => ({
  type: 'checkbox',
}))`
  cursor: pointer;
  ${boxProps};
`;

const Checkbox = ({
  id,
  name,
  checked,
  disabled,
  onToggle,
  className,
  ...props
}) => {
  return (
    <StyledCheckbox
      id={id}
      name={name}
      checked={checked}
      disabled={disabled}
      onChange={onToggle}
      {...getBoxProps(props)}
    />
  );
};

Checkbox.propTypes = {
  ...boxPropTypes,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onToggle: PropTypes.func,
};

Checkbox.defaultprops = {
  name: '',
  checked: false,
  disabled: false,
  onToggle: () => {},
};

export { Checkbox };
