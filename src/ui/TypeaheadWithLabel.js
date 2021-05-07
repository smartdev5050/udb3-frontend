import { forwardRef } from 'react';

import { Label, LabelVariants } from './Label';
import { getStackProps, Stack } from './Stack';
import {
  Typeahead,
  typeaheadDefaultProps,
  typeaheadPropTypes,
} from './Typeahead';

const TypeaheadWithLabel = forwardRef(
  (
    {
      id,
      label,
      options,
      labelKey,
      disabled,
      placeholder,
      emptyLabel,
      minLength,
      className,
      onInputChange,
      onSearch,
      onChange,
      ...props
    },
    ref,
  ) => {
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
          minLength={minLength}
          placeholder={placeholder}
          className={className}
          onInputChange={onInputChange}
          onSearch={onSearch}
          onChange={onChange}
          ref={ref}
        />
      </Stack>
    );
  },
);

TypeaheadWithLabel.propTypes = {
  ...typeaheadPropTypes,
};

TypeaheadWithLabel.defaultProps = {
  ...typeaheadDefaultProps,
  label: '',
};

export { TypeaheadWithLabel };
