import { useEffect, useState } from 'react';
import { theme } from '../components/publiq-ui/theme';
import { useIsClient } from './useIsClient';

const useMatchBreakpoint = (breakpoint, name) => {
  const [matches, setMatches] = useState(false);
  const isClient = useIsClient();

  const handleChange = ({ matches }) => setMatches(matches);

  useEffect(() => {
    if (!breakpoint || !isClient) return;

    const mediaQuery = window.matchMedia(
      `(max-width: ${theme.breakpoints[breakpoint]}px)`,
    );

    mediaQuery.addEventListener('change', handleChange);
    handleChange(mediaQuery); // call once for initial render (when opening the page in mobile view)
  }, [breakpoint, isClient]);

  return matches;
};

export { useMatchBreakpoint };
