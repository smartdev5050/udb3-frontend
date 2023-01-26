import getConfig from 'next/config';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketMessageTypes = {
  EVENT_WAS_LABELED: 'event_was_labelled',
  EVENT_WAS_NOT_LABELLED: 'event_was_not_labelled',
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
