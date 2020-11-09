import { Badge as BootstrapBadge } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { getLayoutProps, spacingProps, spacingPropTypes } from './Box';
import styled from 'styled-components';

const BadgeVariants = {
  DANGER: 'danger',
};

const StyledBootstrapBadge = styled(BootstrapBadge)`
  ${spacingProps};
`;

const Badge = ({ children, className, variant, ...props }) => {
  const layoutProps = getLayoutProps(props);
  return (
    <StyledBootstrapBadge
      className={className}
      variant={variant}
      {...layoutProps}
    >
      {children}
    </StyledBootstrapBadge>
  );
};

Badge.propTypes = {
  ...spacingPropTypes,
  className: PropTypes.string,
  children: PropTypes.node,
  variant: PropTypes.string,
};

Badge.defaultProps = {
  variant: BadgeVariants.DANGER,
};

export { Badge, BadgeVariants };
