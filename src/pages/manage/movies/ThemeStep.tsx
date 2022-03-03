import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { MovieThemes } from '@/constants/MovieThemes';
import type { StepProps } from '@/pages/Steps';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

import type { FormData } from './MovieForm';

const getValue = getValueFromTheme('moviesCreatePage');

const ThemeStep = ({
  control,
  reset,
  field,
  getValues,
  onChange,
}: StepProps<FormData>) => {
  const { t } = useTranslation();

  return (
    <Controller
      name={field}
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
                reset({ ...getValues(), theme: undefined }, { keepDirty: true })
              }
            >
              {t('movies.create.actions.change_theme')}
            </Button>
          </Inline>
        );
      }}
    />
  );
};

export { ThemeStep };
