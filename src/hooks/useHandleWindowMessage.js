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
    if (eventsMap[type]) {
      eventsMap[type](data);
    }
  };
  useEffect(() => {
    if (!window) return;
    window.addEventListener('message', internalHandler);
    return () => window.removeEventListener('message', internalHandler);
  }, []);
};

export { useHandleWindowMessage, WindowMessageTypes };
