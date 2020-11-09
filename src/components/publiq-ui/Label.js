import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Form } from 'react-bootstrap';
import { getLayoutProps, spacingProps, spacingPropTypes } from './Box';

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
  const layoutProps = getLayoutProps(props);
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
