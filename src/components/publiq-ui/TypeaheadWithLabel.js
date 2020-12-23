import uniqueId from 'lodash/uniqueId';
import { Label, LabelVariants } from './Label';
import {
  Typeahead,
  typeaheadDefaultProps,
  typeaheadPropTypes,
} from './Typeahead';
import { getStackProps, Stack, stackPropTypes } from './Stack';

const id = uniqueId('typeahead-');

const TypeaheadWithLabel = ({
  label,
  options,
  disabled,
  placeholder,
  emptyLabel,
  allowNew,
  newSelectionPrefix,
  className,
  onSearch,
  onSelection,
  ...props
}) => {
  return (
    <Stack {...getStackProps(props)}>
      <Label htmlFor={id} variant={LabelVariants.BOLD}>
        {label}
      </Label>
      <Typeahead
        id={id}
        options={options}
        disabled={disabled}
        emptyLabel={emptyLabel}
        allowNew={allowNew}
        newSelectionPrefix={newSelectionPrefix}
        placeholder={placeholder}
        className={className}
        onSearch={onSearch}
        onSelection={onSelection}
      />
    </Stack>
  );
};

TypeaheadWithLabel.propTypes = {
  ...stackPropTypes,
  ...typeaheadPropTypes,
};

TypeaheadWithLabel.defaultProps = {
  ...typeaheadDefaultProps,
  label: '',
};

export { TypeaheadWithLabel };
