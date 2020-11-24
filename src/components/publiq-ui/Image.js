import PropTypes from 'prop-types';
import { Box, boxPropTypes, getBoxProps } from './Box';

const Image = ({ src, alt, width, height, className, ...props }) => {
  return (
    <Box
      forwardedAs="img"
      src={src}
      alt={alt}
      css={`
        width: ${width}px;
        height: ${height ? height + 'px' : 'auto'};
      `}
      className={className}
      {...getBoxProps(props)}
    />
  );
};

Image.propTypes = {
  ...boxPropTypes,
  src: PropTypes.string,
  alt: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
};

Image.defaultProps = {
  width: 600,
};

export { Image };
