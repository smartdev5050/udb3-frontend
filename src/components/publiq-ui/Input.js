import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { spacingProps, spacingPropTypes } from './Box';
import { pick } from 'lodash';
import styled from 'styled-components';

const StyledFormControl = styled(Form.Control)`
  ${spacingProps};
`;

const Input = ({ type, id, placeholder, className, ...props }) => {
  const layoutProps = pick(props, Object.keys(spacingPropTypes));
  return (
    <StyledFormControl
      id={id}
      type={type}
      placeholder={placeholder}
      className={className}
      {...layoutProps}
    />
  );
};

Input.propTypes = {
  ...spacingPropTypes,
  className: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
};

export { Input };
