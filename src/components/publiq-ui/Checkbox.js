import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Label } from './Label';

const StyledDiv = styled.div`
  display: flex;
  align-items: center;

  input {
    margin-right: 0.5rem;
  }

  input:hover {
    cursor: pointer;
  }

  label {
    font-weight: normal;
  }

  label:hover {
    cursor: pointer;
  }
`;

const Checkbox = ({ id, name, checked, disabled, onToggle, children }) => {
  return (
    <StyledDiv>
      <input
        id={id}
        type="checkbox"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={onToggle}
      />
      <Label id={id}>{children}</Label>
    </StyledDiv>
  );
};

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onToggle: PropTypes.func,
  children: PropTypes.node,
};

Checkbox.defaultprops = {
  name: '',
  checked: false,
  disabled: false,
  onInput: () => {},
};

export { Checkbox };
