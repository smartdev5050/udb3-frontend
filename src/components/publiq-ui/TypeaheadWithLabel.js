import uniqueId from 'lodash/uniqueId';
import PropTypes from 'prop-types';
import { Label, LabelVariants } from './Label';
import { Typeahead } from './Typeahead';
import { Stack } from './Stack';
import { boxPropTypes, getBoxProps } from './Box';

const id = uniqueId('typeahead-');

const TypeaheadWithLabel = ({
  label,
  data,
  disabled,
  className,
  onInputChange,
  onSelection,
  ...props
}) => {
  return (
    <Stack {...getBoxProps(props)}>
      <Label htmlFor={id} variant={LabelVariants.BOLD}>
        {label}
      </Label>
      <Typeahead
        id={id}
        data={data}
        disabled={disabled}
        className={className}
        onInputChange={onInputChange}
        onSelection={onSelection}
      />
    </Stack>
  );
};

TypeaheadWithLabel.propTypes = {
  ...boxPropTypes,
  label: PropTypes.string,
  data: PropTypes.array,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onInputChange: PropTypes.func,
  onSelection: PropTypes.func,
};

TypeaheadWithLabel.defaultProps = {
  label: '',
  data: [],
  disabled: false,
  onInputChange: () => {},
  onSelection: () => {},
};

export { TypeaheadWithLabel };
