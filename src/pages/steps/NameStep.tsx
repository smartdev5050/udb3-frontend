import { FormEvent } from 'react';
import { Controller, Path, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { parseSpacing } from '@/ui/Box';
import { FormElement } from '@/ui/FormElement';
import { Input } from '@/ui/Input';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';

import { FormDataUnion, StepProps } from './Steps';

type NameStepProps<TFormData extends FormDataUnion> = StackProps &
  StepProps<TFormData>;

const NameStep = <TFormData extends FormDataUnion>({
  formState: { errors },
  control,
  onChange,
  ...props
}: NameStepProps<TFormData>) => {
  const { t, i18n } = useTranslation();

  const watchedValues = useWatch({ control });

  const scope = watchedValues.scope;

  return (
    <Stack {...getStackProps(props)}>
      <Controller
        name={'nameAndAgeRange' as Path<TFormData>}
        control={control}
        render={({ field }) => {
          return (
            <Stack spacing={2}>
              <FormElement
                label={t(`create.name_and_age.name.title_${scope}`)}
                flex={2}
                id="event-name"
                Component={
                  <Input
                    value={field.value?.name?.nl}
                    onChange={(event) => {
                      field.onChange({
                        ...field.value,
                        name: {
                          [i18n.language]: (event.target as HTMLInputElement)
                            .value,
                        },
                      });
                    }}
                    onBlur={(event: FormEvent<HTMLInputElement>) => {
                      field.onChange({
                        ...field.value,
                        name: {
                          [i18n.language]: (event.target as HTMLInputElement)
                            .value,
                        },
                      });
                      onChange({
                        ...field.value,
                        name: {
                          [i18n.language]: (event.target as HTMLInputElement)
                            .value,
                        },
                      });
                    }}
                  />
                }
                error={
                  // @ts-expect-error
                  errors.nameAndAgeRange?.name &&
                  t('create.name_and_age.validation_messages.name.required')
                }
              />
              <Text
                variant={TextVariants.MUTED}
                maxWidth={parseSpacing(9)}
                dangerouslySetInnerHTML={{
                  __html: t(`create.name_and_age.name.tip_${scope}`),
                }}
                css={`
                  strong {
                    font-weight: bold;
                  }
                `}
              ></Text>
            </Stack>
          );
        }}
      />
    </Stack>
  );
};

export { NameStep };
