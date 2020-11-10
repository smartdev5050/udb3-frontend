import { Badge as BootstrapBadge } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { getBoxProps, boxProps, boxPropTypes } from './Box';
import styled from 'styled-components';

const BadgeVariants = {
  DANGER: 'danger',
};

const StyledBootstrapBadge = styled(BootstrapBadge)`
  ${boxProps};
`;

const Badge = ({ children, className, variant, ...props }) => {
  return (
    <StyledBootstrapBadge
      className={className}
      variant={variant}
      {...getBoxProps(props)}
    >
      {children}
    </StyledBootstrapBadge>
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
