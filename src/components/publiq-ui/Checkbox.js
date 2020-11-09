import { pick } from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { spacingProps, spacingPropTypes } from './Box';

const StyledCheckbox = styled.input.attrs(() => ({
  type: 'checkbox',
}))`
  cursor: pointer;
  ${spacingProps};
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
  const layoutProps = pick(props, Object.keys(spacingPropTypes));
  return (
    <StyledCheckbox
      id={id}
      name={name}
      checked={checked}
      disabled={disabled}
      onChange={onToggle}
      {...layoutProps}
    />
  );
};

Checkbox.propTypes = {
  ...spacingPropTypes,
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
