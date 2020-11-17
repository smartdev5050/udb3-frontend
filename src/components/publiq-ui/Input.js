import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { getBoxProps, boxPropTypes, Box } from './Box';

const Input = ({ type, id, placeholder, className, ...props }) => (
  <Box
    forwardedAs={Form.Control}
    id={id}
    type={type}
    placeholder={placeholder}
    className={className}
    css=""
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
