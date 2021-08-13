import { useEffect } from 'react';

const useLog = (deps: { [key: string]: unknown }) => {
  useEffect(
    // eslint-disable-next-line no-console
    () => console.log(deps),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Object.values(deps),
  );
};

export { useLog };
