import { Badge as BootstrapBadge } from 'react-bootstrap';
import PropTypes from 'prop-types';

const BadgeVariants = {
  DANGER: 'danger',
};

const Badge = ({ children, className, variant }) => (
  <BootstrapBadge className={className} variant={variant}>
    {children}
  </BootstrapBadge>
);

Badge.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  variant: PropTypes.string,
};

Badge.defaultProps = {
  variant: BadgeVariants.DANGER,
};

export { Badge, BadgeVariants };
