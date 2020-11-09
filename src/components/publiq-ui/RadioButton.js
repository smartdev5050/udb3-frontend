import { pick } from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { spacingProps, spacingPropTypes } from './Box';

const StyledRadioButton = styled.input.attrs(() => ({
  type: 'radio',
}))`
  cursor: pointer;
  ${spacingProps};
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
  const layoutProps = pick(props, Object.keys(spacingPropTypes));
  return (
    <StyledRadioButton
      id={id}
      name={name}
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      value={value}
      {...layoutProps}
    />
  );
};

RadioButton.propTypes = {
  ...spacingPropTypes,
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
