import PropTypes from 'prop-types';
import { Box } from './Box';

const Container = ({ children, className }) => (
  <Box
    className={className}
    maxWidth={{
      default: 1170,
      m: 970,
      s: 750,
    }}
    width={{
      default: 1170,
      m: 970,
      s: 750,
    }}
  >
    {children}
  </Box>
);

Container.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Container };
