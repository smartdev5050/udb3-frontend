import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Form } from 'react-bootstrap';
import { getBoxProps, boxProps, boxPropTypes } from './Box';

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
  ${boxProps};
`;

const Label = ({ htmlFor, children, className, variant, ...props }) => {
  return (
    <StyledLabel
      htmlFor={htmlFor}
      className={className}
      variant={variant}
      {...getBoxProps(props)}
    >
      {children}
    </StyledLabel>
  );
};

Label.propTypes = {
  ...boxPropTypes,
  variant: PropTypes.string,
  htmlFor: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

Label.defaultProps = {
  variant: LabelVariants.NORMAL,
};

export { Label };
