import { ProgressBar as BootstrapProgressBar } from 'react-bootstrap';

import type { Values } from '@/types/Values';

import type { BoxProps } from './Box';
import { Box, getBoxProps } from './Box';

const ProgressBarVariants = {
  INFO: 'info',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
} as const;

type Props = BoxProps & {
  progress: number;
  variant: Values<typeof ProgressBarVariants>;
};

const ProgressBar = ({
  children,
  className,
  progress,
  variant,
  ...props
}: Props) => {
  return (
    <Box
      as={BootstrapProgressBar}
      display="flex"
      width="100%"
      now={progress}
      variant={variant}
      {...getBoxProps(props)}
    ></Box>
  );
};

ProgressBar.defaultProps = {};

export { ProgressBar, ProgressBarVariants };
