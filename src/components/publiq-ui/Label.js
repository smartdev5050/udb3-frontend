import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Form } from 'react-bootstrap';
import { spacingProps, spacingPropTypes } from './Box';
import { pick } from 'lodash';

export const LabelVariants = {
  BOLD: 'bold',
  NORMAL: 'normal',
};

const getFontWeight = (props) => {
  if (props.variant === LabelVariants.BOLD) return 700;
  return 'normal';
};

const StyledLabel = styled(Form.Label)`
  font-weight: ${getFontWeight};
  ${spacingProps};
`;

const Label = ({ htmlFor, children, className, variant, ...props }) => {
  const layoutProps = pick(props, Object.keys(spacingPropTypes));
  return (
    <StyledLabel
      htmlFor={htmlFor}
      className={className}
      variant={variant}
      {...layoutProps}
    >
      {children}
    </StyledLabel>
  );
};

Label.propTypes = {
  ...spacingPropTypes,
  variant: PropTypes.string,
  htmlFor: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

Label.defaultProps = {
  variant: LabelVariants.NORMAL,
};

export { Label };
