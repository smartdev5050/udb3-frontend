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
    <Box {...getBoxProps(props)}>
      <BootstrapProgressBar now={progress} variant={variant} />
    </Box>
  );
};

ProgressBar.defaultProps = {};

export { ProgressBar, ProgressBarVariants };
