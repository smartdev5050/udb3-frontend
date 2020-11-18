import PropTypes from 'prop-types';
import { Box } from './Box';

const Image = ({ src, alt, width }) => {
  return (
    <Box
      as="img"
      src={src}
      alt={alt}
      css={`
        width: ${width}px;
        height: auto;
      `}
    />
  );
};

Image.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  width: PropTypes.number,
};

Image.defaultProps = {
  width: 600,
};

export { Image };
