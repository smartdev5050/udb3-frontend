import { Badge as BootStrapBadge } from 'react-bootstrap';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme(`badge`);

const StyledBootStrapBadge = styled(BootStrapBadge)`
  &.badge {
    color: ${getValue('color')};
    background-color: ${getValue('backgroundColor')};
  }
`;

const Badge = ({ children, className }) => (
  <StyledBootStrapBadge className={className}>{children}</StyledBootStrapBadge>
);

Badge.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

Badge.defaultProps = {
  className: false,
  children: '',
};

export { Badge };
