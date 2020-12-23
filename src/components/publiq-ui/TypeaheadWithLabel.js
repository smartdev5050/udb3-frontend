import uniqueId from 'lodash/uniqueId';
import { Label, LabelVariants } from './Label';
import {
  Typeahead,
  typeaheadDefaultProps,
  typeaheadPropTypes,
} from './Typeahead';
import { getStackProps, Stack, stackPropTypes } from './Stack';
import { useEffect, useState } from 'react';

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
  const [id, setId] = useState('');

  useEffect(() => {
    setId(uniqueId('typeahead-'));
  }, []);
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
