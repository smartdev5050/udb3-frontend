import PropTypes from 'prop-types';
import { getBoxProps, boxPropTypes, Box } from './Box';

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
    <Box
      as="input"
      type="radio"
      id={id}
      name={name}
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      value={value}
      className={className}
      cursor="pointer"
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
