import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Box } from '../publiq-ui/Box';
import { Inline } from '../publiq-ui/Inline';
import { Stack } from '../publiq-ui/Stack';
import { Title } from '../publiq-ui/Title';
import { Button, ButtonVariants } from '../publiq-ui/Button';
import { Icon, Icons } from '../publiq-ui/Icon';
import { useEffect, useMemo, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { MessageTypes } from '../../constants/MessageTypes';
import { MessageSources } from '../../constants/MessageSources';
import { List } from '../publiq-ui/List';
import { Job, JobStates } from './Job';

const JobTypes = {
  EXPORT: 'export',
  LABEL_BATCH: 'label_batch',
  LABEL_QUERY: 'label_query',
};

const JobLoggerStates = {
  IDLE: 'idle',
  WARNING: 'warning',
  BUSY: 'busy',
  COMPLETE: 'complete',
};

const initialJobs = [
  {
    id: '1',
    createdAt: new Date(),
    finishedAt: new Date(),
    state: JobStates.CREATED,
    messages: {
      [JobStates.FINISHED]: 'Document .xlsx met 1 evenementen',
    },
    type: JobTypes.EXPORT,
  },
  {
    id: '2',
    createdAt: new Date(),
    finishedAt: new Date(),
    state: JobStates.FAILED,
    messages: {},
    type: JobTypes.EXPORT,
  },
  {
    id: '3',
    createdAt: new Date(),
    finishedAt: new Date(),
    state: JobStates.STARTED,
    messages: {},
    type: JobTypes.EXPORT,
  },
  {
    id: '4',
    createdAt: new Date(),
    finishedAt: new Date(),
    state: JobStates.FINISHED,
    messages: {},
    exportUrl: 'https://google.be',
    type: JobTypes.EXPORT,
  },
  {
    id: '5',
    createdAt: new Date(),
    finishedAt: new Date(),
    state: JobStates.FINISHED,
    messages: {
      [JobStates.FINISHED]: 'Document .xlsx met 1 evenementen',
    },
    exportUrl: 'https://google.be',
    type: JobTypes.EXPORT,
  },
];

const JobTitle = ({ children, className, ...props }) => (
  <Title
    css={`
      width: 100%;
      font-size: 1rem;
      text-transform: uppercase;
      border-bottom: black 1px solid;
    `}
    className={className}
    {...props}
  >
    {children}
  </Title>
);

JobTitle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

const JobLogger = ({ visible, onClose, onStatusChange }) => {
  const { t } = useTranslation();

  const [jobs, setJobs] = useState(initialJobs);
  const [hiddenJobIds, setHiddenJobIds] = useState([]);
  const activeJobs = useMemo(
    () => jobs.filter((job) => !hiddenJobIds.includes(job.id)),
    [jobs, hiddenJobIds],
  );
  const finishedExportJobs = useMemo(
    () =>
      activeJobs.filter(
        (job) =>
          job.state === JobStates.FINISHED && job.type === JobTypes.EXPORT,
      ),
    [activeJobs],
  );
  const failedJobs = useMemo(
    () => activeJobs.filter((job) => job.state === JobStates.FAILED),
    [activeJobs],
  );
  const queuedJobs = useMemo(
    () => [
      ...activeJobs.filter((job) => job.state === JobStates.STARTED),
      ...activeJobs.filter((job) => job.state === JobStates.CREATED),
    ],
    [activeJobs],
  );

  const updateJobState = ({ job_id: jobId }) => (state) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => {
        if (job.id === jobId) {
          return { ...job, state };
        }
        return job;
      }),
    );
  };

  const handleClickHideJob = (id) => {
    setHiddenJobIds((prevHiddenJobIds) => {
      if (prevHiddenJobIds.includes(id)) return;
      return [...prevHiddenJobIds, id];
    });
  };

  const handleMessage = (event) => {
    if (event.data.source !== MessageSources.UDB) {
      return;
    }

    if (
      event.data.type === MessageTypes.JOB_ADDED &&
      event.data.job !== undefined
    ) {
      setJobs((prevJobs) => [
        { ...event.data.job, state: JobStates.CREATED, exportUrl: '' },
        ...prevJobs,
      ]);
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    const socket = socketIOClient(process.env.NEXT_PUBLIC_SOCKET_URL);
    socket.on('job_started', updateJobState(JobStates.STARTED));
    // socket.on('job_info', updateJobState(JobStates.STARTED));
    socket.on('job_finished', updateJobState(JobStates.FINISHED));
    socket.on('job_failed', updateJobState(JobStates.FAILED));
    return () => {
      socket.close();
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    if (failedJobs.length > 0) {
      onStatusChange(JobLoggerStates.WARNING);
      return;
    }
    if (finishedExportJobs.length > 0) {
      onStatusChange(JobLoggerStates.COMPLETE);
      return;
    }
    if (queuedJobs.length > 0) {
      onStatusChange(JobLoggerStates.BUSY);
      return;
    }
    onStatusChange(JobLoggerStates.IDLE);
  }, [failedJobs, finishedExportJobs, queuedJobs]);

  const jobLoggerMenus = [
    {
      title: t('jobs.exported_documents'),
      items: finishedExportJobs,
    },
    {
      title: t('jobs.notifications'),
      items: failedJobs,
    },
    {
      title: t('jobs.in_progress'),
      items: queuedJobs,
    },
  ];

  return (
    <Inline
      css={`
        ${visible && 'display: none;'}
        width: calc(100% - 230px);
        position: absolute;
        left: 230px;
        background-color: white;
      `}
      displ
    >
      <Stack
        padding={3}
        css={`
          width: 320px;
          height: 100vh;
        `}
      >
        <Inline as="div" justifyContent="flex-end">
          <Button variant={ButtonVariants.UNSTYLED} onClick={onClose}>
            <Icon
              name={Icons.TIMES}
              css={`
                opacity: 0.5;
                &:hover {
                  opacity: 1;
                }
              `}
            />
          </Button>
        </Inline>
        <Stack spacing={4}>
          {jobLoggerMenus.map((jobLoggerMenu) => (
            <Stack key={jobLoggerMenu.title}>
              <JobTitle>{jobLoggerMenu.title}</JobTitle>
              <List>
                {jobLoggerMenu.items.map((job) => (
                  <Job
                    key={job.id}
                    id={job.id}
                    createdAt={job.createdAt}
                    finishedAt={job.finishedAt}
                    state={job.state}
                    messages={job.messages}
                    exportUrl={job.exportUrl}
                    onClick={() => handleClickHideJob(job.id)}
                  />
                ))}
              </List>
            </Stack>
          ))}
        </Stack>
      </Stack>
      <Box
        css={`
          background-color: black;
          opacity: 0.5;
          height: 100vh;
          width: calc(100% - 320px);
        `}
      />
    </Inline>
  );
};

JobLogger.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onStatusChange: PropTypes.func,
};

export { JobLogger, JobStates, JobLoggerStates };
