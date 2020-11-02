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

const Input = ({ type, id, label, placeholder }) => (
  <Group controlId={id}>
    <StyledLabel>{label}</StyledLabel>
    <Form.Control type={type} placeholder={placeholder} />
  </Group>
);

Input.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
};

export { Input };
