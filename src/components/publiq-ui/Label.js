import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Form } from 'react-bootstrap';

const StyledLabel = styled(Form.Label)`
  font-weight: 700;
`;

const Label = ({ id, children, className }) => (
  <StyledLabel htmlFor={id} className={className}>
    {children}
  </StyledLabel>
);

Label.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Label };
