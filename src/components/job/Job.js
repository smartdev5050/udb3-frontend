import PropTypes from 'prop-types';
import { Box } from '../publiq-ui/Box';
import { Icon, Icons } from '../publiq-ui/Icon';
import { ListItem } from '../publiq-ui/ListItem';
import { formatDistance } from 'date-fns';
import { nlBE, fr } from 'date-fns/locale';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Inline } from '../publiq-ui/Inline';
import { Stack } from '../publiq-ui/Stack';
import { Button, ButtonVariants } from '../publiq-ui/Button';

const dateFnsLocales = { nl: nlBE, fr };

const JobStates = {
  CREATED: 'created',
  FINISHED: 'finished',
  FAILED: 'failed',
  STARTED: 'started',
};

const Job = ({
  id,
  createdAt,
  finishedAt,
  state,
  messages,
  exportUrl,
  onClick,
}) => {
  const { t, i18n } = useTranslation();
  const timeAgo = useMemo(
    () =>
      formatDistance(
        [JobStates.FINISHED, JobStates.FAILED].includes(state)
          ? finishedAt
          : createdAt,
        new Date(),
        {
          locale: dateFnsLocales[i18n.language.split('-')[0]],
        },
      ),
    [createdAt, finishedAt],
  );

  const description = useMemo(() => (messages && messages[state]) || '', [
    state,
  ]);

  return (
    <ListItem>
      <Stack spacing={3} css="flex: 1;">
        <Inline forwardedAs="div" css="flex: 1;" justifyContent="space-between">
          <Inline as="p" spacing={2}>
            <Box as="span">{t('jobs.time_ago', { time: timeAgo })}</Box>
            {state === JobStates.FINISHED && <Icon name={Icons.CHECK_CIRCLE} />}
            {state === JobStates.STARTED && <Icon name={Icons.CHECK_NOTCH} />}
            <Box>{description}</Box>
          </Inline>
          <Button onClick={onClick} variant={ButtonVariants.UNSTYLED}>
            <Icon name={Icons.TIMES} />
          </Button>
        </Inline>
        <Button variant={ButtonVariants.SECONDARY}>Downloaden</Button>
      </Stack>
    </ListItem>
  );
};

Job.propTypes = {
  id: PropTypes.string,
  createdAt: PropTypes.string,
  finishedAt: PropTypes.string,
  state: PropTypes.oneOf(Object.values(JobStates)),
  messages: PropTypes.object,
  exportUrl: PropTypes.string,
  onClick: PropTypes.func,
};

export { Job, JobStates };
