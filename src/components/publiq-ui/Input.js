import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { getLayoutProps, spacingProps, spacingPropTypes } from './Box';
import styled from 'styled-components';

const StyledFormControl = styled(Form.Control)`
  ${spacingProps};
`;

const Input = ({ type, id, placeholder, className, ...props }) => {
  const layoutProps = getLayoutProps(props);
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
