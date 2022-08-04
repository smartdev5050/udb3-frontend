import { FormEvent } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  useChangeNameMutation,
  useChangeTypicalAgeRangeMutation,
} from '@/hooks/api/events';
import { parseSpacing } from '@/ui/Box';
import { FormElement } from '@/ui/FormElement';
import { Input } from '@/ui/Input';
import { Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';

import { AgeRangeStep } from './AgeRangeStep';
import { FormDataUnion, StepProps } from './Steps';

const useEditNameAndAge = <TFormData extends FormDataUnion>({
  onSuccess,
  eventId,
}) => {
  const changeNameMutation = useChangeNameMutation({
    onSuccess: () => onSuccess('name'),
  });

  const changeTypicalAgeRangeMutation = useChangeTypicalAgeRangeMutation({
    onSuccess: () => onSuccess('name'),
  });

  // @ts-ignore
  return async ({ nameAndAge }: TFormData) => {
    const { name, typicalAgeRange } = nameAndAge;

    if (typicalAgeRange) {
      await changeTypicalAgeRangeMutation.mutateAsync({
        eventId,
        typicalAgeRange,
      });
    }

    await changeNameMutation.mutateAsync({
      id: eventId,
      lang: 'nl',
      name: name.nl,
    });
  };
};

const NameStep = <TFormData extends FormDataIntersection>({
  control,
  field,
  onChange,
}: StepProps<TFormData>) => {
  const { t } = useTranslation();

  return (
    <Controller<TFormData>
      control={control}
      name={field}
      render={({ field }) => {
        return (
          <Stack spacing={4} maxWidth={parseSpacing(11)}>
            <Stack spacing={2}>
              <Text fontWeight="bold">{t('create.step4.name.title')}</Text>
              <FormElement
                flex={2}
                id="event-name"
                Component={
                  <Input
                    value={field.value?.name.nl}
                    placeholder={t('create.step4.name.title')}
                    onChange={(event) => {
                      field.onChange({
                        ...field.value,
                        name: {
                          nl: (event.target as HTMLInputElement).value,
                        },
                      });
                    }}
                    onBlur={(event: FormEvent<HTMLInputElement>) => {
                      field.onChange({
                        ...field.value,
                        name: {
                          nl: (event.target as HTMLInputElement).value,
                        },
                      });
                      onChange({
                        ...field.value,
                        name: {
                          nl: (event.target as HTMLInputElement).value,
                        },
                      });
                    }}
                  />
                }
              />
              <Text
                variant={TextVariants.MUTED}
                maxWidth={parseSpacing(9)}
                dangerouslySetInnerHTML={{ __html: t('create.step4.name.tip') }}
                css={`
                  strong {
                    font-weight: bold;
                  }
                `}
              ></Text>
            </Stack>
            <Stack>
              <AgeRangeStep
                field={field}
                onChange={onChange}
                control={control}
              />
            </Stack>
          </Stack>
        );
      }}
    />
  );
};

const nameStepConfiguration = {
  Component: NameStep,
  field: 'nameAndAge',
  title: (t) => t('create.step4.title'),
};

export { nameStepConfiguration, useEditNameAndAge };
