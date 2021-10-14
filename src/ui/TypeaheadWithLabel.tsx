import type { ForwardedRef, ReactElement } from 'react';
import { forwardRef } from 'react';

import { Label, LabelVariants } from './Label';
import type { StackProps } from './Stack';
import { getStackProps, Stack } from './Stack';
import { Text } from './Text';
import type { TypeaheadProps } from './Typeahead';
import { Typeahead, typeaheadDefaultProps } from './Typeahead';

type Props<T> = Omit<StackProps, 'options' | 'labelKey' | 'onChange'> &
  TypeaheadProps<T> & { error?: string; label?: string; id: string };

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
      error,
      selected,
      ...props
    }: Props<T>,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <Stack spacing={2} {...getStackProps(props)}>
        <Label htmlFor={id} variant={LabelVariants.BOLD}>
          {label}
        </Label>

        <Stack>
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
            isInvalid={!!error}
            selected={selected}
            ref={ref}
          />
          {error && <Text color="red">{error}</Text>}
        </Stack>
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
