import PropTypes from 'prop-types';

import { Label, LabelVariants } from './Label';
import { getStackProps, Stack } from './Stack';
import { TextArea } from './TextArea';

const TextAreaWithLabel = ({
  id,
  label,
  className,
  onInput,
  value,
  disabled,
  rows,
  ...props
}) => {
  return (
    <Stack
      as="div"
      spacing={2}
      className={className}
      {...getStackProps(props)}
      flex={1}
    >
      <Label htmlFor={id} variant={LabelVariants.BOLD}>
        {label}
      </Label>
      <TextArea
        id={id}
        rows={rows}
        onInput={onInput}
        value={value}
        disabled={disabled}
      />
    </Stack>
  );
};

TextAreaWithLabel.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  value: PropTypes.string,
  onInput: PropTypes.func,
  rows: PropTypes.number,
  disabled: PropTypes.bool,
};

export { TextAreaWithLabel };
