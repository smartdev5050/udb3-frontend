import type { ForwardedRef, ReactElement } from 'react';
import { forwardRef } from 'react';
import { AsyncTypeahead as BootstrapTypeahead } from 'react-bootstrap-typeahead';
import { useTranslation } from 'react-i18next';

import type { BoxProps } from './Box';
import { Box, getBoxProps } from './Box';
import { InputType } from './Input';
import { getGlobalBorderRadius, getValueFromTheme } from './theme';

const getValue = getValueFromTheme('typeahead');

type NewEntry = {
  customOption: boolean;
  id: string;
  label: string;
};

const isNewEntry = (value: any): value is NewEntry => {
  return !!value?.customOption;
};

type TypeaheadProps<T> = {
  id?: string;
  name?: string;
  options: T[];
  labelKey: ((option: T) => string) | string;
  disabled?: boolean;
  placeholder?: string;
  emptyLabel?: string;
  minLength?: number;
  inputType?: InputType;
  customFilter?: (option: T) => boolean;
  onChange?: (value: (T | NewEntry)[]) => void;
  allowNew?:
    | boolean
    | ((
        results: Array<Record<string, unknown> | string>,
        props: Record<string, unknown>,
      ) => boolean);
  newSelectionPrefix?: string;
  selected: T[];
};

type Props<T> = Omit<BoxProps, 'onChange' | 'id' | 'labelKey' | 'options'> &
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
      name,
      inputType,
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
      customFilter,
      newSelectionPrefix,
      ...props
    }: Props<T>,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const { t } = useTranslation();

    return (
      <Box
        forwardedAs={BootstrapTypeahead}
        id={id}
        name={name}
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
          input[type='time']::-webkit-calendar-picker-indicator {
            display: none;
          }

          .form-control {
            border-radius: ${getGlobalBorderRadius};
          }

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
        emptyLabel={emptyLabel ?? t('typeahead.no_results')}
        promptText={t('typeahead.prompt_text')}
        searchText={t('typeahead.search_text')}
        minLength={minLength}
        delay={275}
        highlightOnlyResult={!allowNew}
        isInvalid={isInvalid}
        selected={selected}
        inputProps={{
          id,
          type: inputType,
        }}
        {...(customFilter && { filterBy: customFilter })}
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
  inputType: 'text',
};

Typeahead.defaultProps = {
  ...typeaheadDefaultProps,
};

export type { NewEntry, TypeaheadProps };
export { isNewEntry, Typeahead, typeaheadDefaultProps };
