import styled from 'styled-components';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Label } from './Label';

const Group = styled(Form.Group)`
  width: 100%;
  display: flex;
  align-items: center;
`;

const StyledLabel = styled(Label)`
  margin-right: 1rem;
`;

const Input = ({ type, id, label, placeholder, className }) => (
  <Group controlId={id} className={className}>
    {label && <StyledLabel>{label}</StyledLabel>}
    <Form.Control type={type} placeholder={placeholder} />
  </Group>
);

Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
};

export { Input };
