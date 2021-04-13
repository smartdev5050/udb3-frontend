import PropTypes from 'prop-types';
import { Label, LabelVariants } from './Label';
import { getInlineProps, Inline, inlinePropTypes } from './Inline';
import { Input, inputPropTypes } from './Input';

const InputWithLabel = ({
  type,
  id,
  label,
  placeholder,
  className,
  onInput,
  ...props
}) => (
  <Inline
    className={className}
    as="div"
    spacing={3}
    alignItems="center"
    {...getInlineProps(props)}
  >
    <Label htmlFor={id} variant={LabelVariants.BOLD}>
      {label}
    </Label>
    <Input type={type} id={id} placeholder={placeholder} onInput={onInput} />
  </Inline>
);

InputWithLabel.propTypes = {
  ...inlinePropTypes,
  ...inputPropTypes,
  label: PropTypes.string,
};

InputWithLabel.defaultProps = {
  type: 'text',
};

export { InputWithLabel };
