import { useState, useLayoutEffect } from 'react';

const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      setTimeout(() => setIsClient(true), 0);
    }
  }, []);

  return isClient;
};

export { useIsClient };
