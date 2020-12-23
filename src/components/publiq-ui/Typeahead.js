import PropTypes from 'prop-types';
import { AsyncTypeahead as BootstrapTypeahead } from 'react-bootstrap-typeahead';
import { getValueFromTheme } from './theme';
import { Box, boxPropTypes, getBoxProps } from './Box';

const getValue = getValueFromTheme('typeahead');

const Typeahead = ({
  id,
  options,
  disabled,
  placeholder,
  emptyLabel,
  allowNew,
  newSelectionPrefix,
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
      placeholder={placeholder}
      emptyLabel={emptyLabel}
      delay={275}
      allowNew={allowNew}
      newSelectionPrefix={newSelectionPrefix}
      {...getBoxProps(props)}
    />
  );
};

const typeaheadPropTypes = {
  id: PropTypes.string.isRequired,
  options: PropTypes.array,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  emptyLabel: PropTypes.string,
  allowNew: PropTypes.bool,
  newSelectionPrefix: PropTypes.string,
  className: PropTypes.string,
  onSearch: PropTypes.func,
  onSelection: PropTypes.func,
};

Typeahead.propTypes = {
  ...boxPropTypes,
  ...typeaheadPropTypes,
};

const typeaheadDefaultProps = {
  options: [],
  disabled: false,
  newSelectionPrefix: '',
};

Typeahead.defaultProps = {
  ...typeaheadDefaultProps,
};

export { Typeahead, typeaheadPropTypes, typeaheadDefaultProps };
