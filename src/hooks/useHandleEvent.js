import { useEffect } from 'react';
import { useIsClient } from './useIsClient';

const EventTypes = {
  NAVIGATE_PREVIOUS_PAGE: 'popstate',
};

const useHandleEvent = (eventsMap = {}) => {
  const isClient = useIsClient();
  useEffect(() => {
    if (!isClient) return;
    Object.entries(eventsMap).forEach(([type, handler]) => {
      window.addEventListener(type, handler);
    });
    return () => {
      Object.entries(eventsMap).forEach(([type, handler]) => {
        window.removeEventListener(type, handler);
      });
    };
  }, [isClient]);
};

export { useHandleEvent, EventTypes };
