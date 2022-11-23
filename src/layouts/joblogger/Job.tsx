import { formatDistance } from 'date-fns';
import { fr, nlBE } from 'date-fns/locale';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { Values } from '@/types/Values';
import { Box } from '@/ui/Box';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Link, LinkVariants } from '@/ui/Link';
import type { ListItemProps } from '@/ui/List';
import { List } from '@/ui/List';
import { Stack } from '@/ui/Stack';
import { getValueFromTheme } from '@/ui/theme';

const getValue = getValueFromTheme('jobStatusIcon');
const getGlobalValue = getValueFromTheme('global');

const dateFnsLocales = { nl: nlBE, fr };

const JobTypes = {
  EXPORT: 'export',
  LABEL_BATCH: 'label_batch',
  LABEL_QUERY: 'label_query',
} as const;

const JobStates = {
  CREATED: 'created',
  FINISHED: 'finished',
  FAILED: 'failed',
  STARTED: 'started',
} as const;

const StatusIcon = memo(({ state }: { state: Values<typeof JobStates> }) => {
  if (state === JobStates.FINISHED) {
    return <Icon name={Icons.CHECK_CIRCLE} color={getGlobalValue('success')} />;
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

StatusIcon.displayName = 'StatusIcon';

type Message = {
  [key in Values<typeof JobStates>]?: string;
};

type JobType = {
  id: string;
  location: string;
  state: Values<typeof JobStates>;
  createdAt: Date;
  finishedAt: Date;
  exportUrl?: string;
  messages: Message[];
};

type JobProps = ListItemProps & Omit<JobType, 'id' | 'location'>;

const Job = ({
  createdAt,
  finishedAt,
  state,
  messages,
  exportUrl,
  onClick,
}: JobProps) => {
  const { t, i18n } = useTranslation();

  const isDone = ([JobStates.FINISHED, JobStates.FAILED] as Array<
    Values<typeof JobStates>
  >).includes(state);

  const timeAgo = useMemo(
    () =>
      formatDistance(isDone ? finishedAt : createdAt, new Date(), {
        locale: dateFnsLocales[i18n.language],
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {!!exportUrl && state === JobStates.FINISHED && (
          <Link href={exportUrl} variant={LinkVariants.BUTTON_SECONDARY}>
            {t('jobs.download')}
          </Link>
        )}
      </Stack>
    </List.Item>
  );
};

export type { JobType };
export { Job, JobStates, JobTypes };
