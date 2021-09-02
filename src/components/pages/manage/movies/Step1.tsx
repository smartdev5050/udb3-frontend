import { useTranslation } from 'react-i18next';

import { MovieThemes } from '@/constants/MovieThemes';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

import type { MachineProps } from './create';
import { MovieEventTypes } from './create';
import type { StepProps } from './Step';
import { Step } from './Step';

const getValue = getValueFromTheme('moviesCreatePage');

type Step1Props = StepProps & MachineProps;

const Step1 = ({
  stepNumber,
  movieState,
  sendMovieEvent,
  ...props
}: Step1Props) => {
  const { t } = useTranslation();

  return (
    <Step stepNumber={stepNumber}>
      <Stack spacing={5} {...getStackProps(props)}>
        <Inline spacing={3} flexWrap="wrap" maxWidth="70rem">
          {movieState.context.theme === null ? (
            Object.entries(MovieThemes).map(([key, value]) => (
              <Button
                width="auto"
                marginBottom={3}
                display="inline-flex"
                key={key}
                variant={ButtonVariants.SECONDARY}
                onClick={() =>
                  sendMovieEvent({ type: MovieEventTypes.CHOOSE_THEME, value })
                }
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
              <Button
                variant={ButtonVariants.LINK}
                onClick={() =>
                  sendMovieEvent({ type: MovieEventTypes.CLEAR_THEME })
                }
              >
                {t('movies.create.actions.change_theme')}
              </Button>
            </Inline>
          )}
        </Inline>
      </Stack>
    </Step>
  );
};

export { Step1 };
