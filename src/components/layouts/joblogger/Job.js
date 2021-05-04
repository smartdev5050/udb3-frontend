import { formatDistance } from 'date-fns';
import { fr, nlBE } from 'date-fns/locale';
import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@/ui/Box';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Link, LinkVariants } from '@/ui/Link';
import { List } from '@/ui/List';
import { Stack } from '@/ui/Stack';
import { getValueFromTheme } from '@/ui/theme';

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

const StatusIcon = memo(({ state }) => {
  if (state === JobStates.FINISHED) {
    return (
      <Icon
        name={Icons.CHECK_CIRCLE}
        color={getValue('complete.circleFillColor')}
      />
    );
  }
  return (
    <Icon
      name={Icons.CHECK_NOTCH}
      color={getValue('busy.spinnerStrokeColor')}
      css={`
        @keyframes rotation {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(359deg);
          }
        }
        .svg-inline--fa {
          animation: rotation 1s infinite linear;
        }
      `}
    />
  );
});

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
              {state !== JobStates.FAILED && <StatusIcon state={state} />}
            </Inline>
            <Box forwardedAs="p" css="word-break: break-word;">
              {messages?.[state] ?? ''}
            </Box>
          </Stack>
          <Button onClick={onClick} variant={ButtonVariants.UNSTYLED}>
            <Icon name={Icons.TIMES} alignItems="center" />
          </Button>
        </Inline>
        {!!exportUrl && (
          <Link href={exportUrl} variant={LinkVariants.BUTTON_SECONDARY}>
            {t('jobs.download')}
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
