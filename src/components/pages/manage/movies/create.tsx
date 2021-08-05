import { useMachine } from '@xstate/react';
import { MovieEventTypes, movieMachine } from 'machines/movie';
import { useTranslation } from 'react-i18next';

import { MovieThemes } from '@/constants/MovieThemes';
import type { Values } from '@/types/Values';
import { Box } from '@/ui/Box';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Page } from '@/ui/Page';
import type { StackProps } from '@/ui/Stack';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { TimeTable } from '@/ui/TimeTable';
import { Title } from '@/ui/Title';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

const getValue = getValueFromTheme('moviesCreatePage');

type StepProps = StackProps & { step: number };

const Step = ({ step, children, ...props }: StepProps) => {
  const { t } = useTranslation();

  return (
    <Stack spacing={4} {...getStackProps(props)}>
      <Title
        color={getValue('title.color')}
        lineHeight="220%"
        alignItems="center"
        spacing={3}
        css={`
          border-bottom: 1px solid ${getValue('title.borderColor')};
        `}
      >
        <Box
          borderRadius="50%"
          width="1.8rem"
          height="1.8rem"
          lineHeight="1.8rem"
          backgroundColor={getValue('stepNumber.backgroundColor')}
          padding={0}
          fontSize="1rem"
          fontWeight="bold"
          color="white"
          textAlign="center"
        >
          {step}
        </Box>
        <Text>{t(`movies.create.step${step}_title`)}</Text>
      </Title>
      {children}
    </Stack>
  );
};

const Step1 = (props: StackProps) => {
  const [movieState, sendMovieEvent] = useMachine(movieMachine);

  const { t } = useTranslation();

  const handleSelectTheme = (value: Values<typeof MovieThemes>) => {
    sendMovieEvent(MovieEventTypes.CHOOSE_THEME, { value });
  };

  const handleClearTheme = () => sendMovieEvent(MovieEventTypes.CLEAR_THEME);

  return (
    <Step step={1} {...getStackProps(props)}>
      <Stack spacing={5}>
        <Inline spacing={3} flexWrap="wrap" maxWidth="70rem">
          {movieState.context.theme === null ? (
            Object.entries(MovieThemes).map(([key, value]) => (
              <Button
                width="auto"
                marginBottom={3}
                display="inline-flex"
                key={key}
                variant={ButtonVariants.SECONDARY}
                onClick={() => handleSelectTheme(value)}
              >
                {t(`themes*${value}`, { keySeparator: '*' })}
              </Button>
            ))
          ) : (
            <Inline alignItems="center" spacing={3}>
              <Icon
                name={Icons.CHECK_CIRCLE}
                color={getValue('check.circleFillColor')}
              />
              <Text>
                {t(`themes*${movieState.context.theme}`, { keySeparator: '*' })}
              </Text>
              <Button variant={ButtonVariants.LINK} onClick={handleClearTheme}>
                {t('movies.create.actions.change_theme')}
              </Button>
            </Inline>
          )}
        </Inline>
      </Stack>
    </Step>
  );
};

const Step2 = (props: StackProps) => {
  return (
    <Step step={2} {...getStackProps(props)}>
      <TimeTable id="timetable-movies" />
    </Step>
  );
};

const Create = () => {
  const { t } = useTranslation();

  return (
    <Page>
      <Page.Title key="title" spacing={3} alignItems="center">
        {t(`movies.create.title`)}
      </Page.Title>
      <Page.Content spacing={4}>
        <Step1 />
        <Step2 />
      </Page.Content>
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export default Create;
