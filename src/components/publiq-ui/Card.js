import { Card as BootstrapCard } from 'react-bootstrap';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { getBoxProps, boxProps, boxPropTypes } from './Box';

const StyledBootstrapCard = styled(BootstrapCard)`
  &.card {
    border: none;
  }

  ${boxProps}
`;

const Card = ({ children, className, ...props }) => {
  return (
    <StyledBootstrapCard className={className} {...getBoxProps(props)}>
      <StyledBootstrapCard.Body>{children}</StyledBootstrapCard.Body>
    </StyledBootstrapCard>
  );
};

Card.propTypes = {
  ...boxPropTypes,
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Card };
