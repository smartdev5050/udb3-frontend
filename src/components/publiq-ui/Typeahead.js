import PropTypes from 'prop-types';
import { Typeahead as BootstrapTypeahead } from 'react-bootstrap-typeahead';
import styled from 'styled-components';
import { getValueFromTheme } from './theme';
import { boxProps, boxPropTypes, getBoxProps } from './Box';

const getValue = getValueFromTheme('typeahead');

const StyledBootstrapTypeahead = styled(BootstrapTypeahead)`
  .dropdown-item.active,
  .dropdown-item:active {
    background-color: ${getValue('activeBackgroundColor')};
  }

  ${boxProps};
`;

const Typeahead = ({
  id,
  data,
  disabled,
  className,
  onInputChange,
  onSelection,
  ...props
}) => {
  return (
    <StyledBootstrapTypeahead
      id={id}
      options={data}
      labelKey={(option) => option}
      disabled={disabled}
      className={className}
      onInputChange={onInputChange}
      onChange={onSelection}
      {...getBoxProps(props)}
    />
  );
};

Typeahead.propTypes = {
  ...boxPropTypes,
  id: PropTypes.string.isRequired,
  data: PropTypes.array,
  disabled: PropTypes.bool,
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
