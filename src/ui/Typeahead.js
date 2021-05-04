import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { AsyncTypeahead as BootstrapTypeahead } from 'react-bootstrap-typeahead';

import { Box, boxPropTypes, getBoxProps } from './Box';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme('typeahead');

const Typeahead = forwardRef(
  (
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
    },
    ref,
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

const typeaheadPropTypes = {
  id: PropTypes.string.isRequired,
  options: PropTypes.array,
  labelKey: PropTypes.func,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  emptyLabel: PropTypes.string,
  minLength: PropTypes.number,
  className: PropTypes.string,
  onInputChange: PropTypes.func,
  onSearch: PropTypes.func,
  onChange: PropTypes.func,
};

Typeahead.propTypes = {
  ...boxPropTypes,
  ...typeaheadPropTypes,
};

const typeaheadDefaultProps = {
  options: [],
  labelKey: (item) => item,
  onSearch: async () => {},
  disabled: false,
  minLength: 3,
};

Typeahead.defaultProps = {
  ...typeaheadDefaultProps,
};

export { Typeahead, typeaheadDefaultProps,typeaheadPropTypes };
