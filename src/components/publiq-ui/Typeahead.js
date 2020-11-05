import uniqueId from 'lodash/uniqueId';
import PropTypes from 'prop-types';
import { Typeahead as BootstrapTypeahead } from 'react-bootstrap-typeahead';
import styled from 'styled-components';
import { Label } from './Label';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme('typeahead');

const StyledBootstrapTypeahead = styled(BootstrapTypeahead)`
  .dropdown-item.active,
  .dropdown-item:active {
    background-color: ${getValue('activeBackgroundColor')};
  }
`;

const id = uniqueId('typeahead-');

const Typeahead = ({
  label,
  data,
  disabled,
  className,
  onInputChange,
  onSelection,
}) => {
  return (
    <>
      {label && <Label htmlFor={id}>{label}</Label>}
      <StyledBootstrapTypeahead
        id={id}
        options={data}
        labelKey={(option) => option}
        disabled={disabled}
        className={className}
        onInputChange={onInputChange}
        onChange={onSelection}
      />
    </>
  );
};

Typeahead.propTypes = {
  label: PropTypes.string,
  data: PropTypes.array,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onInputChange: PropTypes.func,
  onSelection: PropTypes.func,
};

Typeahead.defaultProps = {
  label: '',
  data: [],
  disabled: false,
  onInputChange: () => {},
  onSelection: () => {},
};

export { Typeahead };
