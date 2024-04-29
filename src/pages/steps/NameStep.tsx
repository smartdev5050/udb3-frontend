import { FormEvent } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { parseSpacing } from '@/ui/Box';
import { FormElement } from '@/ui/FormElement';
import { Input } from '@/ui/Input';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';

import { StepProps } from './Steps';

type NameStepProps = StackProps & StepProps;

const NameStep = ({
  formState: { errors },
  control,
  watch,
  onChange,
  mainLanguage,
  ...props
}: NameStepProps) => {
  const { t, i18n } = useTranslation();

  const scope = watch('scope');

  return (
    <Stack {...getStackProps(props)}>
      <Controller
        name={'nameAndAgeRange'}
        control={control}
        render={({ field }) => {
          const language = mainLanguage ?? i18n.language;

          return (
            <Stack spacing={2}>
              <FormElement
                label={t(`create.name_and_age.name.title_${scope}`)}
                flex={2}
                id="event-name"
                maxLength={90}
                Component={
                  <Input
                    value={field.value?.name?.[language]}
                    onChange={(event) => {
                      field.onChange({
                        ...field.value,
                        name: {
                          [language]: (event.target as HTMLInputElement).value,
                        },
                      });
                    }}
                    onBlur={(event: FormEvent<HTMLInputElement>) => {
                      field.onChange({
                        ...field.value,
                        name: {
                          [language]: (event.target as HTMLInputElement).value,
                        },
                      });
                      onChange({
                        ...field.value,
                        name: {
                          [language]: (event.target as HTMLInputElement).value,
                        },
                      });
                    }}
                  />
                }
                info={t(`create.name_and_age.name.tip_${scope}`)}
                error={
                  errors.nameAndAgeRange?.name &&
                  t('create.name_and_age.validation_messages.name.required')
                }
              />
            </Stack>
          );
        }}
      />
    </Stack>
  );
};

export { NameStep };
