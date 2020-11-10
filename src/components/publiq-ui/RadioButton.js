import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getBoxProps, boxProps, boxPropTypes } from './Box';

const StyledRadioButton = styled.input.attrs(() => ({
  type: 'radio',
}))`
  cursor: pointer;
  ${boxProps};
`;

const RadioButton = ({
  id,
  name,
  checked,
  disabled,
  onChange,
  className,
  value,
  ...props
}) => {
  return (
    <StyledRadioButton
      id={id}
      name={name}
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      value={value}
      {...getBoxProps(props)}
    />
  );
};

RadioButton.propTypes = {
  ...boxPropTypes,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  value: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

RadioButton.defaultprops = {
  name: '',
  checked: false,
  disabled: false,
  onChange: () => {},
};

export { RadioButton };
