import PropTypes from 'prop-types';
import { Stack, stackProps } from './Stack';

const List = ({ children, spacing, className }) => (
  <Stack className={className} spacing={spacing} as="ul">
    {children}
  </Stack>
);

List.propTypes = {
  ...stackProps,
  className: PropTypes.string,
  children: PropTypes.node,
};

export { List };
