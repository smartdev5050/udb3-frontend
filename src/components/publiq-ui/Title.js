import PropTypes from 'prop-types';
import { Box, boxPropTypes, getBoxProps } from './Box';

const getFontWeight = (props) => {
  if (props.size === 1) return 300;
  return 700;
};

const getFontSize = (props) => {
  if (props.size === 1) return 1.6;
  return 1.2;
};

const Title = ({ size, children, className, ...props }) => (
  <Box
    forwardedAs={`h${size}`}
    size={size}
    className={className}
    css={`
      font-weight: ${getFontWeight};
      font-size: ${getFontSize}rem;
    `}
    {...getBoxProps(props)}
  >
    {children}
  </Box>
);

Title.propTypes = {
  ...boxPropTypes,
  size: PropTypes.oneOf([1, 2]),
  className: PropTypes.string,
  children: PropTypes.node,
};

Title.defaultProps = {
  size: 2,
};

export { Title };
