import { useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const SocketMessageTypes = {
  JOB_STARTED: 'job_started',
  JOB_INFO: 'job_info',
  JOB_FINISHED: 'job_finished',
  JOB_FAILED: 'job_failed',
};

const useHandleSocketMessages = (eventsMap = {}) => {
  useEffect(() => {
    const socket = socketIOClient(process.env.NEXT_PUBLIC_SOCKET_URL);
    Object.entries(([event, handler]) => socket.on(event, handler));
    return () => socket.close();
  }, []);
};

export { useHandleSocketMessages, SocketMessageTypes };
