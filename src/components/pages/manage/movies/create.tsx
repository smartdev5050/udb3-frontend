import { useMachine } from '@xstate/react';
import type { MovieContext, MovieEvent } from 'machines/movie';
import { movieMachine } from 'machines/movie';
import { useTranslation } from 'react-i18next';
import type { State } from 'xstate';

import { Box } from '@/ui/Box';
import { Page } from '@/ui/Page';
import type { StackProps } from '@/ui/Stack';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { Title } from '@/ui/Title';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

import { Step1Content } from './Step1Content';
import { Step2Content } from './Step2Content';
import { Step3Content } from './Step3Content';

const getValue = getValueFromTheme('moviesCreatePage');

type StepProps = StackProps & { step: number };

type MachineProps = {
  movieState: State<MovieContext, MovieEvent>;
  sendMovieEvent: (event: MovieEvent) => State<MovieContext, MovieEvent>;
};

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

const Create = () => {
  const [movieState, sendMovieEvent] = useMachine(movieMachine);

  const { t } = useTranslation();

  return (
    <Page>
      <Page.Title spacing={3} alignItems="center">
        {t(`movies.create.title`)}
      </Page.Title>
      <Page.Content spacing={5}>
        {[Step1Content, Step2Content, Step3Content].map(
          (StepContent, index) => (
            <Step key={index} step={index + 1}>
              <StepContent
                movieState={movieState}
                sendMovieEvent={sendMovieEvent}
              />
            </Step>
          ),
        )}
      </Page.Content>
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export type { MachineProps };
export default Create;
