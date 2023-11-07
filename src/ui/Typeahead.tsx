import 'react-bootstrap-typeahead/css/Typeahead.css';

import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';
import type { TypeaheadModel } from 'react-bootstrap-typeahead';
import { AsyncTypeahead as BootstrapTypeahead } from 'react-bootstrap-typeahead';
import { useTranslation } from 'react-i18next';

import { InputType } from '@/ui/Input';

import type { BoxProps } from './Box';
import { Box, getBoxProps } from './Box';
import {
  getGlobalBorderRadius,
  getGlobalFormInputHeight,
  getValueFromTheme,
} from './theme';

const getValue = getValueFromTheme('typeahead');

type NewEntry = {
  customOption: boolean;
  id: string;
  label: string;
};

const isNewEntry = (value: any): value is NewEntry => {
  return !!value?.customOption;
};

type Props<T extends TypeaheadModel> = BoxProps<T> & {
  isInvalid?: boolean;
  inputType?: InputType;
  inputRequired?: boolean;
  hideNewInputText?: boolean;
};

const TypeaheadInner = <T extends TypeaheadModel>(
  {
    id,
    name,
    inputType = 'text',
    inputRequired,
    options,
    labelKey,
    renderMenuItemChildren,
    disabled = false,
    placeholder,
    emptyLabel,
    minLength = 3,
    className,
    onInputChange,
    defaultInputValue,
    onBlur,
    onFocus,
    onSearch = async () => {},
    onChange,
    isInvalid,
    selected,
    allowNew,
    filterBy,
    hideNewInputText,
    newSelectionPrefix,
    positionFixed,
    isLoading,
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
      allowNew={allowNew && !isLoading}
      newSelectionPrefix={newSelectionPrefix}
      options={options}
      labelKey={labelKey}
      renderMenuItemChildren={renderMenuItemChildren}
      isLoading={isLoading}
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
          height: ${getGlobalFormInputHeight};
          padding: 0.375rem 0.9rem;
        }

        .dropdown-item {
          border-bottom: 1px solid ${({ theme }) => theme.colors.grey1};
        }

        .dropdown-item > .rbt-highlight-text {
          display: initial;
        }

        .rbt-menu-custom-option {
          padding: 1rem 1.5rem;
        }

        .dropdown-item.rbt-menu-custom-option > .rbt-highlight-text {
          display: ${hideNewInputText ? 'none' : 'initial'};
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
      searchText={t('typeahead.search_text')}
      minLength={minLength}
      delay={275}
      highlightOnlyResult={!allowNew}
      isInvalid={isInvalid}
      selected={selected}
      defaultInputValue={defaultInputValue}
      onBlur={onBlur}
      onFocus={onFocus}
      positionFixed={positionFixed}
      inputProps={{
        id,
        type: inputType,
        required: inputRequired,
      }}
      filterBy={filterBy ?? (() => true)}
      {...getBoxProps(props)}
    />
  );
};

const Typeahead = forwardRef(TypeaheadInner) as <T extends TypeaheadModel>(
  props: Props<T> & { ref?: ForwardedRef<HTMLInputElement> },
) => ReturnType<typeof TypeaheadInner<T>>;

export type { NewEntry };
export { isNewEntry, Typeahead };
