import PropTypes from 'prop-types';
import { Box, boxPropTypes, getBoxProps } from './Box';

const Small = ({ children, className, ...props }) => (
  <Box
    forwardedAs="small"
    className={className}
    css={`
      font-size: 0.65rem;
    `}
    {...getBoxProps(props)}
  >
    {children}
  </Box>
);

Small.propTypes = {
  ...boxPropTypes,
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Small };
