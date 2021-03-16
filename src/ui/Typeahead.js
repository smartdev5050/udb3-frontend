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
  onInputChange,
  onSearch,
  onChange,
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
          color: ${getValue('color')};
          background-color: ${getValue('activeBackgroundColor')};
        }
      `}
      onSearch={onSearch}
      onInputChange={onInputChange}
      onChange={onChange}
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
  onSearch: async () => {},
  disabled: false,
};

Typeahead.defaultProps = {
  ...typeaheadDefaultProps,
};

export { Typeahead, typeaheadPropTypes, typeaheadDefaultProps };
