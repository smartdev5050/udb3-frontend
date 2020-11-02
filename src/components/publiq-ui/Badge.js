import { Badge as BootstrapBadge } from 'react-bootstrap';
import PropTypes from 'prop-types';

export const BadgeVariants = {
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

export { Badge };
