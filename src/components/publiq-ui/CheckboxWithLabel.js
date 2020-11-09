import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Checkbox } from './Checkbox';
import { Inline } from './Inline';
import { Label } from './Label';

const StyledLabel = styled(Label)`
  cursor: pointer;
`;

const CheckboxWithLabel = ({
  id,
  name,
  checked,
  disabled,
  onToggle,
  children,
  className,
}) => (
  <Inline className={className} alignItems="center" spacing={3}>
    <Checkbox id={id} onToggle={onToggle} />
    <StyledLabel htmlFor={id}>{children}</StyledLabel>
  </Inline>
);

CheckboxWithLabel.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onToggle: PropTypes.func,
  children: PropTypes.node,
};

CheckboxWithLabel.defaultprops = {
  name: '',
  checked: false,
  disabled: false,
  onToggle: () => {},
};

export { CheckboxWithLabel };
