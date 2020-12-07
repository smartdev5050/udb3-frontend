import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { getBoxProps, boxPropTypes, Box } from './Box';

const BaseInput = (props) => <Box as="input" {...props} />;

const Input = ({ type, id, placeholder, className, ...props }) => (
  <Form.Control
    forwardedAs={BaseInput}
    id={id}
    type={type}
    placeholder={placeholder}
    className={className}
    maxWidth="43rem"
    css="border-radius: 0;"
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
