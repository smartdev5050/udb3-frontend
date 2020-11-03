import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledSmall = styled.small`
  font-size: 0.65rem;
`;

const Small = ({ children, className }) => (
  <StyledSmall className={className}>{children}</StyledSmall>
);

Small.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Small };
