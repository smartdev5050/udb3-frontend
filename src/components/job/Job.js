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
import { getValueFromTheme } from '../publiq-ui/theme';
import { Link, LinkVariants } from '../publiq-ui/Link';

const getValue = getValueFromTheme('jobStatusIcon');

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
  const isDone = [JobStates.FINISHED, JobStates.FAILED].includes(state);
  const timeAgo = useMemo(
    () =>
      formatDistance(isDone ? finishedAt : createdAt, new Date(), {
        locale: dateFnsLocales[i18n.language.split('-')[0]],
      }),
    [createdAt, finishedAt],
  );

  const description = useMemo(() => (messages && messages[state]) || '', [
    state,
  ]);

  return (
    <ListItem paddingTop={3}>
      <Stack spacing={3} css="flex: 1;">
        <Inline forwardedAs="div" css="flex: 1;" justifyContent="space-between">
          <Inline as="p" spacing={2}>
            <Box as="span">{t('jobs.time_ago', { time: timeAgo })}</Box>
            {state === JobStates.FINISHED && (
              <Icon
                name={Icons.CHECK_CIRCLE}
                css={`
                  color: ${getValue('complete.circleFillColor')};
                `}
              />
            )}
            {!isDone && (
              <Icon
                name={Icons.CHECK_NOTCH}
                css={`
                  color: ${getValue('busy.spinnerStrokeColor')};
                `}
              />
            )}
            <Box>{description}</Box>
          </Inline>
          <Button onClick={onClick} variant={ButtonVariants.UNSTYLED}>
            <Icon name={Icons.TIMES} />
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
