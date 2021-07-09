import { useState } from 'react';

type Key = 'seenAnnouncements';

type SeenAnnouncements = string[];

const isSeenAnnouncements = (
  key: Key,
  value: any,
): value is SeenAnnouncements => {
  return key === 'seenAnnouncements';
};

const useLocalStorage = () => {
  const [localStorageApi] = useState({
    /**
     * Returns the current value associated with the given key, or null if the given key does not exist in the list associated with the object.
     */
    getItem: (key: Key) => {
      const value = JSON.parse(localStorage.getItem(key));
      if (isSeenAnnouncements(key, value)) {
        return value;
      }
      return null;
    },
    /**
     * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
     */
    setItem: (key: Key, value: any) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
  });

  return localStorageApi;
};

export { useLocalStorage };
