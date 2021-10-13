import type { ForwardedRef, ReactElement } from 'react';
import { forwardRef } from 'react';

import { Label, LabelVariants } from './Label';
import type { StackProps } from './Stack';
import { getStackProps, Stack } from './Stack';
import type { TypeaheadProps } from './Typeahead';
import { Typeahead, typeaheadDefaultProps } from './Typeahead';

type Props<T> = Omit<StackProps, 'options' | 'labelKey' | 'onChange'> &
  TypeaheadProps<T> & { label?: string; id: string };

type TypeaheadFunc = (<T>(
  props: Props<T> & { ref?: ForwardedRef<HTMLInputElement> },
) => ReactElement) & {
  displayName?: string;
  defaultProps?: { [key: string]: unknown };
};

const TypeaheadWithLabel: TypeaheadFunc = forwardRef(
  <T,>(
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
    }: Props<T>,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <Stack spacing={2} {...getStackProps(props)}>
        <Label htmlFor={id} variant={LabelVariants.BOLD}>
          {label}
        </Label>
        <Typeahead<T>
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

TypeaheadWithLabel.displayName = 'TypeaheadWithLabel';

TypeaheadWithLabel.defaultProps = {
  ...typeaheadDefaultProps,
  label: '',
};

export { TypeaheadWithLabel };
