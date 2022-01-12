import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { MovieThemes } from '@/constants/MovieThemes';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import type { StackProps } from '@/ui/Stack';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

import type { StepProps } from './MoviePage';

const getValue = getValueFromTheme('moviesCreatePage');

type Step1Props = StackProps & StepProps;

const Step1 = ({
  errors,
  control,
  reset,
  getValues,
  onChange,
  ...props
}: Step1Props) => {
  const { t } = useTranslation();

  return (
    <Stack {...getStackProps(props)}>
      <Controller
        name="theme"
        control={control}
        render={({ field }) => {
          if (!field.value) {
            return (
              <Inline spacing={3} flexWrap="wrap" maxWidth="70rem">
                {Object.entries(MovieThemes).map(([key, value]) => (
                  <Button
                    width="auto"
                    marginBottom={3}
                    display="inline-flex"
                    key={key}
                    variant={ButtonVariants.SECONDARY}
                    onClick={() => {
                      field.onChange(value);
                      onChange(value);
                    }}
                  >
                    {t(`themes*${value}`, { keySeparator: '*' })}
                  </Button>
                ))}
              </Inline>
            );
          }

          return (
            <Inline alignItems="center" spacing={3}>
              <Icon
                name={Icons.CHECK_CIRCLE}
                color={getValue('check.circleFillColor')}
              />
              <Text>
                {t(`themes*${field.value}`, {
                  keySeparator: '*',
                })}
              </Text>
              <Button
                variant={ButtonVariants.LINK}
                onClick={() =>
                  reset(
                    { ...getValues(), theme: undefined },
                    { keepDirty: true },
                  )
                }
              >
                {t('movies.create.actions.change_theme')}
              </Button>
            </Inline>
          );
        }}
      />
    </Stack>
  );
};

export { Step1 };
