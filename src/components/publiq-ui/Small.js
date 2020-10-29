import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledSmall = styled.small`
  font-size: 65%;
`;

const Small = ({ children }) => {
  return <StyledSmall>{children}</StyledSmall>;
};

Small.propTypes = {
  children: PropTypes.node,
};

export { Small };
