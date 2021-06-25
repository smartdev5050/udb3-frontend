import type { BoxProps } from './Box';
import { Box, getBoxProps } from './Box';

type Props = BoxProps & {
  src: string;
  alt: string;
};

const Image = ({ src, alt, className, ...props }: Props) => (
  <Box
    as="img"
    src={src}
    alt={alt}
    className={className}
    {...getBoxProps(props)}
  />
);

Image.defaultProps = {
  width: 600,
  height: 'auto',
};

export { Image };
