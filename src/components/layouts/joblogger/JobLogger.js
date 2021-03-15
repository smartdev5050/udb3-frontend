import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { Box } from '@/ui/Box';
import { Inline } from '@/ui/Inline';
import { Stack } from '@/ui/Stack';
import { Title } from '@/ui/Title';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { List } from '@/ui/List';

import { Job, JobStates } from './Job';

import {
  useHandleWindowMessage,
  WindowMessageTypes,
} from '@/hooks/useHandleWindowMessage';

import {
  useHandleSocketMessage,
  SocketMessageTypes,
} from '@/hooks/useHandleSocketMessage';

const JobLoggerStates = {
  IDLE: 'idle',
  WARNING: 'warning',
  BUSY: 'busy',
  COMPLETE: 'complete',
};

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

  const [jobs, setJobs] = useState([]);
  const [hiddenJobIds, setHiddenJobIds] = useState([]);

  const activeJobs = useMemo(
    () => jobs.filter((job) => !hiddenJobIds.includes(job.id)),
    [jobs, hiddenJobIds],
  );

  const finishedJobs = useMemo(
    () => activeJobs.filter((job) => job.state === JobStates.FINISHED),
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

  const updateJobState = (newJobState) => ({ job_id: jobId, location }) =>
    setJobs((previousJobs) =>
      previousJobs.map((job) => {
        const { id, finishedAt, exportUrl } = job;
        if (id !== jobId) return job;

        if (job.state === JobStates.FAILED) {
          // Jobs can't transition from a failed status to another status.
          return job;
        }

        return {
          ...job,
          state: newJobState,
          finishedAt: [JobStates.FINISHED, JobStates.FAILED].includes(
            newJobState,
          )
            ? new Date()
            : finishedAt,
          exportUrl: location || exportUrl,
        };
      }),
    );

  const addJob = ({ job }) =>
    setJobs((previousJobs) => [
      {
        ...job,
        state: JobStates.CREATED,
        exportUrl: '',
        createdAt: new Date(),
      },
      ...previousJobs,
    ]);

  const handleClickHideJob = (id) =>
    setHiddenJobIds((prevHiddenJobIds) => {
      if (prevHiddenJobIds.includes(id)) return prevHiddenJobIds;
      return [...prevHiddenJobIds, id];
    });

  useHandleSocketMessage({
    [SocketMessageTypes.JOB_STARTED]: updateJobState(JobStates.STARTED),
    [SocketMessageTypes.JOB_INFO]: updateJobState(JobStates.STARTED),
    [SocketMessageTypes.JOB_FINISHED]: updateJobState(JobStates.FINISHED),
    [SocketMessageTypes.JOB_FAILED]: updateJobState(JobStates.FAILED),
  });

  useHandleWindowMessage({
    [WindowMessageTypes.JOB_ADDED]: addJob,
  });

  useEffect(() => {
    if (failedJobs.length > 0) {
      onStatusChange(JobLoggerStates.WARNING);
      return;
    }
    if (finishedJobs.length > 0) {
      onStatusChange(JobLoggerStates.COMPLETE);
      return;
    }
    if (queuedJobs.length > 0) {
      onStatusChange(JobLoggerStates.BUSY);
      return;
    }
    onStatusChange(JobLoggerStates.IDLE);
  }, [failedJobs, finishedJobs, queuedJobs]);

  const jobLoggerMenus = [
    {
      title: t('jobs.finished'),
      items: finishedJobs,
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
      `}
      position="absolute"
      height="100%"
      width={{ default: 'calc(100% - 230px)', s: 'calc(100% - 65px)' }}
      left={{ default: 230, s: 65 }}
      zIndex={1998}
    >
      <Stack padding={3} width={320} backgroundColor="white">
        <Inline as="div" justifyContent="flex-end">
          <Button variant={ButtonVariants.UNSTYLED} onClick={onClose}>
            <Icon name={Icons.TIMES} opacity={{ default: 0.5, hover: 1 }} />
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
      <Box flex={1} opacity={0.5} backgroundColor="black" onClick={onClose} />
    </Inline>
  );
};

JobLogger.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onStatusChange: PropTypes.func,
};

export { JobLogger, JobStates, JobLoggerStates };
