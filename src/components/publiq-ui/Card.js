import { Card as BootstrapCard } from 'react-bootstrap';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledBootstrapCard = styled(BootstrapCard)`
  &.card {
    border: none;
  }
`;

const Card = ({ children, className }) => (
  <StyledBootstrapCard className={className}>
    <StyledBootstrapCard.Body>{children}</StyledBootstrapCard.Body>
  </StyledBootstrapCard>
);

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Card };
