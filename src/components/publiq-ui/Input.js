import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { getBoxProps, boxProps, boxPropTypes } from './Box';
import styled from 'styled-components';

const StyledFormControl = styled(Form.Control)`
  ${boxProps};
`;

const Input = ({ type, id, placeholder, className, ...props }) => {
  return (
    <StyledFormControl
      id={id}
      type={type}
      placeholder={placeholder}
      className={className}
      {...getBoxProps(props)}
    />
  );
};

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
