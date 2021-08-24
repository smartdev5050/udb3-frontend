import type { ForwardedRef, ReactElement } from 'react';
import { forwardRef } from 'react';
import { AsyncTypeahead as BootstrapTypeahead } from 'react-bootstrap-typeahead';

import type { BoxProps } from './Box';
import { Box, getBoxProps } from './Box';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme('typeahead');

type TypeaheadProps<T> = {
  options: T[];
  labelKey: (option: T) => string;
  disabled?: boolean;
  placeholder?: string;
  emptyLabel?: string;
  minLength?: number;
  onChange?: (value: T) => void;
};

type Props<T> = Omit<BoxProps, 'onChange'> & TypeaheadProps<T>;

type TypeaheadFunc = (<T>(
  props: Props<T> & { ref: ForwardedRef<HTMLInputElement> },
) => ReactElement) & {
  displayName?: string;
  defaultProps?: { [key: string]: unknown };
};

const Typeahead: TypeaheadFunc = forwardRef(
  <T,>(
    {
      id,
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
      <Box
        forwardedAs={BootstrapTypeahead}
        id={id}
        options={options}
        labelKey={labelKey}
        isLoading={false}
        disabled={disabled}
        className={className}
        css={`
          .dropdown-item.active,
          .dropdown-item:active {
            color: ${getValue('active.color')};
            background-color: ${getValue('active.backgroundColor')};
            .rbt-highlight-text {
              color: ${getValue('active.color')};
            }
          }
          .rbt-highlight-text {
            font-weight: ${getValue('highlight.fontWeight')};
            background-color: ${getValue('highlight.backgroundColor')};
          }
        `}
        onSearch={onSearch}
        onInputChange={onInputChange}
        onChange={onChange}
        placeholder={placeholder}
        emptyLabel={emptyLabel}
        minLength={minLength}
        delay={275}
        highlightOnlyResult
        ref={ref}
        {...getBoxProps(props)}
      />
    );
  },
);

Typeahead.displayName = 'Typeahead';

const typeaheadDefaultProps = {
  labelKey: (item) => item,
  onSearch: async () => {},
  disabled: false,
  minLength: 3,
};

Typeahead.defaultProps = {
  ...typeaheadDefaultProps,
};

export type { TypeaheadProps };
export { Typeahead, typeaheadDefaultProps };
