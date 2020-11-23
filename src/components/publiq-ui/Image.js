import PropTypes from 'prop-types';
import { Box } from './Box';

const Image = ({ src, alt, width, className }) => {
  return (
    <Box
      as="img"
      src={src}
      alt={alt}
      css={`
        width: ${width}px;
        height: auto;
      `}
      className={className}
    />
  );
};

Image.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  width: PropTypes.number,
  className: PropTypes.string,
};

Image.defaultProps = {
  width: 600,
};

export { Image };
