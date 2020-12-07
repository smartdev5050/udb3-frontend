import PropTypes from 'prop-types';
import { getInlineProps, Inline, inlinePropTypes } from './Inline';
import { Text } from './Text';

const getFontWeight = (props) => {
  if (props.size === 1) return 300;
  return 700;
};

const getFontSize = (props) => {
  if (props.size === 1) return 1.6;
  return 1.2;
};

const Title = ({ size, children, className, ...props }) => (
  <Inline
    forwardedAs={`h${size}`}
    {...getInlineProps(props)}
    size={size}
    className={className}
    css={`
      font-weight: ${getFontWeight};
      font-size: ${getFontSize}rem;
    `}
  >
    <Text>{children}</Text>
  </Inline>
);

Title.propTypes = {
  ...inlinePropTypes,
  size: PropTypes.oneOf([1, 2]),
  className: PropTypes.string,
  children: PropTypes.node,
};

Title.defaultProps = {
  size: 2,
};

export { Title };
