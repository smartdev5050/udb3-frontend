import { Badge as BootstrapBadge } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { getBoxProps, boxPropTypes } from './Box';
import { Text } from './Text';

const BadgeVariants = {
  DANGER: 'danger',
};

const BaseBadge = (props) => <Text {...props} />;

const Badge = ({ children, className, variant, ...props }) => {
  return (
    <BootstrapBadge
      as={BaseBadge}
      className={className}
      variant={variant}
      {...getBoxProps(props)}
    >
      {children}
    </BootstrapBadge>
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
