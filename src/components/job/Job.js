import PropTypes from 'prop-types';
import { Box } from '../publiq-ui/Box';
import { Icon, Icons } from '../publiq-ui/Icon';
import { List } from '../publiq-ui/List';
import { formatDistance } from 'date-fns';
import { nlBE, fr } from 'date-fns/locale';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Inline } from '../publiq-ui/Inline';
import { Stack } from '../publiq-ui/Stack';
import { Button, ButtonVariants } from '../publiq-ui/Button';
import { getValueFromTheme } from '../publiq-ui/theme';
import { Link, LinkVariants } from '../publiq-ui/Link';

const getValue = getValueFromTheme('jobStatusIcon');

const dateFnsLocales = { nl: nlBE, fr };

const JobTypes = {
  EXPORT: 'export',
  LABEL_BATCH: 'label_batch',
  LABEL_QUERY: 'label_query',
};

const JobStates = {
  CREATED: 'created',
  FINISHED: 'finished',
  FAILED: 'failed',
  STARTED: 'started',
};

const StatusIcon = ({ state }) => {
  switch (state) {
    case JobStates.FINISHED:
      return (
        <Icon
          name={Icons.CHECK_CIRCLE}
          css={`
            color: ${getValue('complete.circleFillColor')};
          `}
        />
      );
    case JobStates.FAILED:
      return null;
    default:
      return (
        <Icon
          name={Icons.CHECK_NOTCH}
          css={`
            color: ${getValue('busy.spinnerStrokeColor')};
          `}
        />
      );
  }
};

StatusIcon.propTypes = {
  state: PropTypes.oneOf(Object.values(JobStates)),
};

const Job = ({
  createdAt,
  finishedAt,
  state,
  messages,
  exportUrl,
  onClick,
}) => {
  const { t, i18n } = useTranslation();

  const isDone = [JobStates.FINISHED, JobStates.FAILED].includes(state);

  const timeAgo = useMemo(
    () =>
      formatDistance(isDone ? finishedAt : createdAt, new Date(), {
        locale: dateFnsLocales[i18n.language],
      }),
    [createdAt, finishedAt],
  );

  return (
    <List.Item paddingTop={3}>
      <Stack as="div" spacing={3} flex={1}>
        <Inline as="div" flex={1} justifyContent="space-between">
          <Stack>
            <Inline forwardedAs="div" spacing={2} css="word-break: break-word;">
              <Box as="span">{t('jobs.time_ago', { time: timeAgo })}</Box>
              <StatusIcon state={state} />
            </Inline>
            <Box forwardedAs="p" css="word-break: break-word;">
              {messages?.[state] ?? ''}
            </Box>
          </Stack>
          <Button onClick={onClick} variant={ButtonVariants.UNSTYLED}>
            <Icon name={Icons.TIMES} alignItems="center" />
          </Button>
        </Inline>
        {exportUrl && (
          <Link href={exportUrl} variant={LinkVariants.UNSTYLED}>
            <Button variant={ButtonVariants.SECONDARY}>
              {t('jobs.download')}
            </Button>
          </Link>
        )}
      </Stack>
    </List.Item>
  );
};

Job.propTypes = {
  createdAt: PropTypes.instanceOf(Date),
  finishedAt: PropTypes.instanceOf(Date),
  state: PropTypes.oneOf(Object.values(JobStates)),
  messages: PropTypes.object,
  exportUrl: PropTypes.string,
  onClick: PropTypes.func,
};

export { Job, JobStates, JobTypes };
