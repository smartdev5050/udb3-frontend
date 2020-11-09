import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Input = ({ type, id, placeholder, className }) => (
  <Form.Control
    id={id}
    type={type}
    placeholder={placeholder}
    className={className}
  />
);

Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
};

export { Input };
