import { useMediaQuery } from '@material-ui/core';
import { theme } from '../components/publiq-ui/theme';

const useMatchBreakpoint = (breakpoint) =>
  useMediaQuery(`(max-width: ${theme.breakpoints[breakpoint]}px)`);

export { useMatchBreakpoint };
