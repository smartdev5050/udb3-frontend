import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Label } from './Label';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;

  .custom-radio {
    font-weight: 700;
  }

  .radio-container {
    display: flex;
    align-items: center;
  }

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

const RadioGroup = ({
  name,
  groupLabel,
  items,
  selected,
  className,
  onChange,
}) => {
  return (
    <fieldset className={className}>
      {groupLabel && <Label htmlFor={`radiogroup-${name}`}>{groupLabel}</Label>}
      <StyledDiv id={`radiogroup-${name}`} role="radiogroup">
        {items.map((item) => (
          <div key={item.value} className="radio-container">
            <input
              id={`radio-${item.value}`}
              type="radio"
              value={item.value}
              name={name}
              className="custom-radio"
              onChange={onChange}
              checked={selected === item.value}
            />
            <Label htmlFor={`radio-${item.value}`}>{item.label}</Label>
          </div>
        ))}
      </StyledDiv>
    </fieldset>
  );
};

RadioGroup.propTypes = {
  name: PropTypes.string.isRequired,
  groupLabel: PropTypes.string,
  items: PropTypes.array,
  selected: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
};

RadioGroup.defaultProps = {
  name: '',
  groupLabel: '',
  items: [],
  selected: '',
  onChange: () => {},
};

export { RadioGroup };
