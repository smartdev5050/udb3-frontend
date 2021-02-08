import PropTypes from 'prop-types';
import { getBoxProps, boxPropTypes, Box } from './Box';

const RadioButton = ({
  id,
  name,
  disabled,
  onChange,
  value,
  checked,
  className,
  ...props
}) => {
  return (
    <Box
      as="input"
      type="radio"
      id={id}
      name={name}
      disabled={disabled}
      checked={checked}
      onChange={onChange}
      value={value}
      className={className}
      cursor="pointer"
      {...getBoxProps(props)}
    />
  );
};

const radioButtonPropTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string,
};

RadioButton.propTypes = {
  ...boxPropTypes,
  ...radioButtonPropTypes,
};

const radioButtonDefaultProps = {
  disabled: false,
};

RadioButton.defaultprops = {
  ...radioButtonDefaultProps,
};

export { RadioButton, radioButtonPropTypes, radioButtonDefaultProps };
