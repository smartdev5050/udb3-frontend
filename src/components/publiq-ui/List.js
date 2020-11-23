import PropTypes from 'prop-types';
import { getStackProps, Stack, stackPropTypes } from './Stack';

const ListVariants = {
  ORDERED: 'ordered',
  UNORDERED: 'unordered',
};

const List = ({ children, className, variant, ...props }) => (
  <Stack
    forwardedAs={variant === ListVariants.ORDERED ? 'ol' : 'ul'}
    className={className}
    variant={variant}
    {...getStackProps(props)}
  >
    {children}
  </Stack>
);

List.propTypes = {
  ...stackPropTypes,
  className: PropTypes.string,
  children: PropTypes.node,
};

List.defaultProps = {
  variant: ListVariants.UNORDERED,
};

export { List, ListVariants };
