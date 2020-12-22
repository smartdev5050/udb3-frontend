import PropTypes from 'prop-types';
import { AsyncTypeahead as BootstrapTypeahead } from 'react-bootstrap-typeahead';
import { getValueFromTheme } from './theme';
import { Box, boxPropTypes, getBoxProps } from './Box';

const getValue = getValueFromTheme('typeahead');

const Typeahead = ({
  id,
  options,
  disabled,
  defaultInputValue,
  className,
  onSearch,
  onSelection,
  ...props
}) => {
  return (
    <Box
      forwardedAs={BootstrapTypeahead}
      id={id}
      options={options}
      labelKey={(option) => option}
      disabled={disabled}
      className={className}
      css={`
        .dropdown-item.active,
        .dropdown-item:active {
          background-color: ${getValue('activeBackgroundColor')};
        }
      `}
      onSearch={onSearch}
      onChange={onSelection}
      defaultInputValue={defaultInputValue}
      {...getBoxProps(props)}
    />
  );
};

Typeahead.propTypes = {
  ...boxPropTypes,
  id: PropTypes.string.isRequired,
  data: PropTypes.array,
  disabled: PropTypes.bool,
  defaultInputValue: PropTypes.string,
  className: PropTypes.string,
  onInputChange: PropTypes.func,
  onSelection: PropTypes.func,
};

Typeahead.defaultProps = {
  data: [],
  disabled: false,
  onInputChange: () => {},
  onSelection: () => {},
};

export { Typeahead };
