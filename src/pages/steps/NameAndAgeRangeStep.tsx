import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  useChangeNameMutation,
  useChangeTypicalAgeRangeMutation,
} from '@/hooks/api/events';
import { parseSpacing } from '@/ui/Box';
import { Stack } from '@/ui/Stack';

import { AgeRangeStep } from './AgeRangeStep';
import { NameStep } from './NameStep';
import { FormDataUnion, StepProps, StepsConfiguration } from './Steps';

const useEditNameAndAgeRange = <TFormData extends FormDataUnion>({
  onSuccess,
  eventId,
}) => {
  const changeNameMutation = useChangeNameMutation({
    onSuccess: () => onSuccess('name'),
  });

  const changeTypicalAgeRangeMutation = useChangeTypicalAgeRangeMutation({
    onSuccess: () => onSuccess('name'),
  });

  return async ({ nameAndAgeRange }: TFormData) => {
    const { name, typicalAgeRange } = nameAndAgeRange;

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

const NameAndAgeRangeStep = <TFormData extends FormDataUnion>({
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
            <NameStep field={field} onChange={onChange} control={control} />
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

const nameAndAgeRangeStepConfiguration: StepsConfiguration<FormDataUnion> = {
  Component: NameAndAgeRangeStep,
  field: 'nameAndAgeRange',
  title: (t) => t('create.step4.title'),
};

export { nameAndAgeRangeStepConfiguration, useEditNameAndAgeRange };
