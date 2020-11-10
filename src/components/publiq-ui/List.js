import PropTypes from 'prop-types';
import { getBoxProps } from './Box';
import { Stack, stackProps } from './Stack';

const List = ({ children, spacing, className, ...props }) => {
  return (
    <Stack
      className={className}
      spacing={spacing}
      as="ul"
      {...getBoxProps(props)}
    >
      {children}
    </Stack>
  );
};

List.propTypes = {
  ...stackProps,
  className: PropTypes.string,
  children: PropTypes.node,
};

export { List };
