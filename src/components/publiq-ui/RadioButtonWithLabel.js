import PropTypes from 'prop-types';
import {
  RadioButton,
  radioButtonDefaultProps,
  radioButtonPropTypes,
} from './RadioButton';
import { Inline } from './Inline';
import { Label } from './Label';
import { getBoxProps, boxPropTypes } from './Box';

const RadioButtonWithLabel = ({
  id,
  name,
  disabled,
  onChange,
  label,
  value,
  className,
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
      <RadioButton id={id} onChange={onChange} value={value} name={name} />
      <Label cursor="pointer" htmlFor={id}>
        {label}
      </Label>
    </Inline>
  );
};

RadioButtonWithLabel.propTypes = {
  ...boxPropTypes,
  ...radioButtonPropTypes,
  label: PropTypes.node,
};

RadioButtonWithLabel.defaultprops = {
  ...radioButtonDefaultProps,
};

export { RadioButtonWithLabel };
