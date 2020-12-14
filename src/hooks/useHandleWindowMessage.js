import { useEffect } from 'react';

const WindowMessageSources = {
  UDB: 'UDB',
};

const WindowMessageTypes = {
  URL_CHANGED: 'URL_CHANGED',
  JOB_ADDED: 'JOB_ADDED',
};

const useHandleWindowMessage = (eventsMap = {}) => {
  const internalHandler = (event) => {
    const { source, type, ...data } = event.data;
    if (source !== WindowMessageSources.UDB) return;
    eventsMap?.[type]?.(data); // call handler when it exists
  };
  useEffect(() => {
    if (!window) return;
    window.addEventListener('message', internalHandler);
    return () => window.removeEventListener('message', internalHandler);
  }, []);
};

export { useHandleWindowMessage, WindowMessageTypes };