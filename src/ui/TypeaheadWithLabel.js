import { Label, LabelVariants } from './Label';
import {
  Typeahead,
  typeaheadDefaultProps,
  typeaheadPropTypes,
} from './Typeahead';
import { getStackProps, Stack, stackPropTypes } from './Stack';

const TypeaheadWithLabel = ({
  id,
  label,
  options,
  labelKey,
  disabled,
  placeholder,
  emptyLabel,
  className,
  onInputChange,
  onSearch,
  onChange,
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
        labelKey={labelKey}
        disabled={disabled}
        emptyLabel={emptyLabel}
        placeholder={placeholder}
        className={className}
        onInputChange={onInputChange}
        onSearch={onSearch}
        onChange={onChange}
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
