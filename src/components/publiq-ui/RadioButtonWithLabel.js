import PropTypes from 'prop-types';
import styled from 'styled-components';
import { RadioButton } from './RadioButton';
import { Inline } from './Inline';
import { Label } from './Label';
import { getBoxProps, boxPropTypes } from './Box';

const StyledLabel = styled(Label)`
  cursor: pointer;
`;

const RadioButtonWithLabel = ({
  id,
  name,
  checked,
  disabled,
  onChange,
  label,
  className,
  value,
  selected,
  ...props
}) => {
  return (
    <Inline
      className={className}
      alignItems="center"
      spacing={3}
      as="li"
      {...getBoxProps(props)}
    >
      <RadioButton
        id={id}
        onChange={onChange}
        value={value}
        selected={selected}
        name={name}
      />
      <StyledLabel htmlFor={id}>{label}</StyledLabel>
    </Inline>
  );
};

RadioButtonWithLabel.propTypes = {
  ...boxPropTypes,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  selected: PropTypes.boolean,
  value: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.node,
};

RadioButtonWithLabel.defaultprops = {
  name: '',
  checked: false,
  disabled: false,
  onChange: () => {},
};

export { RadioButtonWithLabel };
