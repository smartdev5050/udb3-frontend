import { useEffect, useState } from 'react';

// see https://github.com/tannerlinsley/react-query/issues/293
// see https://usehooks.com/useDebounce/
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export { useDebounce };
