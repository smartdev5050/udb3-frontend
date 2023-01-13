import getConfig from 'next/config';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketMessageTypes = {
  JOB_STARTED: 'job_started',
  JOB_INFO: 'job_info',
  JOB_FINISHED: 'job_finished',
  JOB_FAILED: 'job_failed',
};

type Handler = (...args: any[]) => void;

const useHandleSocketMessage = (eventsMap = {}) => {
  const { publicRuntimeConfig } = getConfig();

  useEffect(() => {
    const socket = io(publicRuntimeConfig.socketUrl, {
      transports: ['websocket'],
    });

    Object.entries<Handler>(eventsMap).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      socket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export { SocketMessageTypes, useHandleSocketMessage };
