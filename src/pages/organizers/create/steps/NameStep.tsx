import { FormEvent } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { StepProps } from '@/pages/steps/Steps';
import { FormElement } from '@/ui/FormElement';
import { Input } from '@/ui/Input';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';

type NameStepProps = StackProps & StepProps;

const NameStep = ({
  formState: { errors },
  control,
  watch,
  onChange,
  mainLanguage,
  name,
  ...props
}: NameStepProps) => {
  const { t, i18n } = useTranslation();

  return (
    <Stack {...getStackProps(props)}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <Stack spacing={2}>
              <FormElement
                label="Naam"
                id="organizer-name"
                flex={2}
                Component={
                  <Input
                    value={field.value?.name}
                    onChange={(event) => {
                      field.onChange({
                        ...field.value,
                        name: (event.target as HTMLInputElement).value,
                      });
                    }}
                    onBlur={(event: FormEvent<HTMLInputElement>) => {
                      field.onChange({
                        ...field.value,
                        name: (event.target as HTMLInputElement).value,
                      });
                      //   onChange({
                      //     ...field.value,
                      //     name: (event.target as HTMLInputElement).value,
                      //   });
                    }}
                  />
                }
                error={
                  errors.nameAndUrl?.name?.type === 'required' &&
                  t('organizers.create.step1.errors.name_required')
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
