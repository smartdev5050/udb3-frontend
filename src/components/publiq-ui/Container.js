import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledDiv = styled.div`
  @media (min-width: 768px) {
    width: 750px;
    max-width: 750px;
  }

  @media (min-width: 992px) {
    width: 970px;
    max-width: 970px;
  }

  @media (min-width: 1200px) {
    width: 1170px;
    max-width: 1170px;
  }
`;

const Container = ({ children, className }) => (
  <StyledDiv className={className}>{children}</StyledDiv>
);

Container.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Container };
