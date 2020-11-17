import { Badge as BootstrapBadge } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Box, getBoxProps, boxPropTypes } from './Box';

const BadgeVariants = {
  DANGER: 'danger',
};

const Badge = ({ children, className, variant, ...props }) => {
  return (
    <Box
      forwardedAs={BootstrapBadge}
      className={className}
      variant={variant}
      css=""
      {...getBoxProps(props)}
    >
      {children}
    </Box>
  );
};

Badge.propTypes = {
  ...boxPropTypes,
  className: PropTypes.string,
  children: PropTypes.node,
  variant: PropTypes.string,
};

Badge.defaultProps = {
  variant: BadgeVariants.DANGER,
};

export { Badge, BadgeVariants };
