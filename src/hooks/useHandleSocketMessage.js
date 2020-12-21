import getConfig from 'next/config';
import { useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const SocketMessageTypes = {
  JOB_STARTED: 'job_started',
  JOB_INFO: 'job_info',
  JOB_FINISHED: 'job_finished',
  JOB_FAILED: 'job_failed',
};

const useHandleSocketMessage = (eventsMap = {}) => {
  const { publicRuntimeConfig } = getConfig();

  useEffect(() => {
    const socket = socketIOClient(publicRuntimeConfig.socketUrl);
    Object.entries(eventsMap).forEach(([event, handler]) => {
      socket.on(event, handler);
    });
    return () => socket.close();
  }, []);
};

export { useHandleSocketMessage, SocketMessageTypes };
