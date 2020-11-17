import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { getBoxProps, boxPropTypes, Box } from './Box';

const BaseInput = (props) => <Box as="input" {...props} />;

const Input = ({ type, id, placeholder, className, ...props }) => (
  <Form.Control
    forwardAs={BaseInput}
    id={id}
    type={type}
    placeholder={placeholder}
    className={className}
    {...getBoxProps(props)}
  />
);

Input.propTypes = {
  ...boxPropTypes,
  className: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
};

export { Input };
