import PropTypes from 'prop-types';

import { Box, getBoxProps } from './Box';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme('text');

const TextVariants = {
  REGULAR: 'regular',
  MUTED: 'muted',
};

const Text = ({ as, children, className, variant, ...props }) => {
  return (
    <Box
      as={as}
      className={className}
      color={variant === TextVariants.MUTED && getValue('muted.color')}
      {...getBoxProps(props)}
    >
      {children}
    </Box>
  );
};

Text.propTypes = {
  as: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.string,
};

Text.defaultProps = {
  as: 'span',
  variant: TextVariants.REGULAR,
};

export { Text, TextVariants };
