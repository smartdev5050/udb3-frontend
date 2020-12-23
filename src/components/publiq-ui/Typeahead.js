import PropTypes from 'prop-types';
import { AsyncTypeahead as BootstrapTypeahead } from 'react-bootstrap-typeahead';
import { getValueFromTheme } from './theme';
import { Box, boxPropTypes, getBoxProps } from './Box';

const getValue = getValueFromTheme('typeahead');

const Typeahead = ({
  id,
  options,
  labelKey,
  disabled,
  placeholder,
  emptyLabel,
  className,
  onInput,
  onSearch,
  onSelection,
  ...props
}) => {
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
          background-color: ${getValue('activeBackgroundColor')};
        }
      `}
      onSearch={onSearch}
      onInputChange={onInput}
      onChange={onSelection}
      placeholder={placeholder}
      emptyLabel={emptyLabel}
      delay={275}
      {...getBoxProps(props)}
    />
  );
};

const typeaheadPropTypes = {
  id: PropTypes.string.isRequired,
  options: PropTypes.array,
  labelKey: PropTypes.func,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  emptyLabel: PropTypes.string,
  className: PropTypes.string,
  onInput: PropTypes.func,
  onSearch: PropTypes.func,
  onSelection: PropTypes.func,
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
};

Typeahead.defaultProps = {
  ...typeaheadDefaultProps,
};

export { Typeahead, typeaheadPropTypes, typeaheadDefaultProps };
