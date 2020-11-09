import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Checkbox } from './Checkbox';
import { Inline } from './Inline';
import { Label } from './Label';
import { spacingProps, spacingPropTypes } from './Box';
import { pick } from 'lodash';

const StyledLabel = styled(Label)`
  cursor: pointer;

  ${spacingProps};
`;

const CheckboxWithLabel = ({
  id,
  name,
  checked,
  disabled,
  onToggle,
  children,
  className,
  ...props
}) => {
  const layoutProps = pick(props, Object.keys(spacingPropTypes));
  return (
    <Inline
      className={className}
      alignItems="center"
      spacing={3}
      {...layoutProps}
    >
      <Checkbox
        id={id}
        onToggle={onToggle}
        name={name}
        checked={checked}
        disabled={disabled}
      />
      <StyledLabel htmlFor={id}>{children}</StyledLabel>
    </Inline>
  );
};

CheckboxWithLabel.propTypes = {
  ...spacingPropTypes,
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
