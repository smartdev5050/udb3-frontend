import { Card as BootstrapCard } from 'react-bootstrap';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { pick } from 'lodash';
import { spacingProps, spacingPropTypes } from './Box';

const StyledBootstrapCard = styled(BootstrapCard)`
  &.card {
    border: none;
  }

  ${spacingProps}
`;

const Card = ({ children, className, ...props }) => {
  const layoutProps = pick(props, Object.keys(spacingPropTypes));
  return (
    <StyledBootstrapCard className={className} {...layoutProps}>
      <StyledBootstrapCard.Body>{children}</StyledBootstrapCard.Body>
    </StyledBootstrapCard>
  );
};

Card.propTypes = {
  ...spacingPropTypes,
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Card };
