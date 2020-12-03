import PropTypes from 'prop-types';
import { Box, boxPropTypes, getBoxProps } from './Box';

const Text = ({ as, children, className, ...props }) => {
  return (
    <Box as={as} className={className} {...getBoxProps}>
      {children}
    </Box>
  );
};

Text.propTypes = {
  ...boxPropTypes,
  as: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

Text.defaultProps = {
  as: 'span',
};

export { Text };
