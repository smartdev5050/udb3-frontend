import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledLabel = styled.label`
  font-weight: 700;
  margin-bottom: 0;
`;

const Label = ({ id, children }) => {
  return <StyledLabel htmlFor={id}>{children}</StyledLabel>;
};

Label.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
};

Label.defaultTypes = {
  id: '',
};

export { Label };
