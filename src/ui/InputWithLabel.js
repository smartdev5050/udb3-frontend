import PropTypes from 'prop-types';
import { Label, LabelVariants } from './Label';
import { Inline } from './Inline';
import { Input } from './Input';
import { boxPropTypes, getBoxProps } from './Box';

const InputWithLabel = ({
  type,
  id,
  children,
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
    {...getBoxProps(props)}
  >
    <Label htmlFor={id} variant={LabelVariants.BOLD}>
      {children}
    </Label>
    <Input type={type} id={id} placeholder={placeholder} onInput={onInput} />
  </Inline>
);

InputWithLabel.propTypes = {
  ...boxPropTypes,
  className: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string.isRequired,
  children: PropTypes.string,
  placeholder: PropTypes.string,
  onInput: PropTypes.func,
};

InputWithLabel.defaultProps = {
  type: 'text',
};

export { InputWithLabel };
