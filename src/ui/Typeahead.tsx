import type { ForwardedRef, ReactElement } from 'react';
import { forwardRef } from 'react';
import { AsyncTypeahead as BootstrapTypeahead } from 'react-bootstrap-typeahead';

import type { BoxProps } from './Box';
import { Box, getBoxProps } from './Box';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme('typeahead');

type TypeaheadProps<T> = {
  id?: string;
  options: T[];
  labelKey: ((option: T) => string) | string;
  disabled?: boolean;
  placeholder?: string;
  emptyLabel?: string;
  minLength?: number;
  onChange?: (value: T[]) => void;
  allowNew?:
    | boolean
    | ((results: Array<Object | string>, props: Object) => boolean);
  newSelectionPrefix?: string;
  selected: T[];
};

type Props<T> = Omit<BoxProps, 'onChange' | 'id' | 'labelKey'> &
  TypeaheadProps<T> & { isInvalid?: boolean };

type TypeaheadFunc = (<T>(
  props: Props<T> & { ref?: ForwardedRef<HTMLInputElement> },
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
      isInvalid,
      selected,
      allowNew,
      newSelectionPrefix,
      ...props
    }: Props<T>,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <Box
        forwardedAs={BootstrapTypeahead}
        id={id}
        allowNew={allowNew}
        newSelectionPrefix={newSelectionPrefix}
        options={options}
        labelKey={labelKey}
        isLoading={false}
        disabled={disabled}
        className={className}
        flex={1}
        ref={ref}
        css={`
          .dropdown-item.active,
          .dropdown-item:active {
            color: ${getValue('active.color')};
            background-color: ${getValue('active.backgroundColor')};
            .rbt-highlight-text {
              color: ${getValue('active.color')};
            }
          }
          .dropdown-item.hover,
          .dropdown-item:hover {
            color: ${getValue('hover.color')};
            background-color: ${getValue('hover.backgroundColor')};
            .rbt-highlight-text {
              color: ${getValue('hover.color')};
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
        highlightOnlyResult={!allowNew}
        isInvalid={isInvalid}
        selected={selected}
        inputProps={{
          id,
        }}
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
