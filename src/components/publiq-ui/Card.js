import { Card as BootstrapCard } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { getBoxProps, boxPropTypes, Box } from './Box';

const Card = ({ children, className, ...props }) => (
  <BootstrapCard
    forwardedAs={Box}
    className={className}
    {...getBoxProps(props)}
    css={`
      &.card {
        border: none;
      }
    `}
  >
    <BootstrapCard.Body>{children}</BootstrapCard.Body>
  </BootstrapCard>
);

Card.propTypes = {
  ...boxPropTypes,
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Card };
