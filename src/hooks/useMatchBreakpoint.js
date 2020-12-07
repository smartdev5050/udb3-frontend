import { useMediaQuery } from '@react-hook/media-query';
import { theme } from '../components/publiq-ui/theme';

const useMatchBreakpoint = (breakpoint) =>
  useMediaQuery(`(max-width: ${theme.breakpoints[breakpoint]}px)`);

export { useMatchBreakpoint };
