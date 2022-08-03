import { FormEvent } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useChangeNameMutation } from '@/hooks/api/events';
import { parseSpacing } from '@/ui/Box';
import { FormElement } from '@/ui/FormElement';
import { Input } from '@/ui/Input';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';

import { FormDataIntersection, StepProps } from './Steps';

const useEditName = <TFormData extends FormDataIntersection>({
  onSuccess,
  eventId,
}) => {
  const changeNameMutation = useChangeNameMutation({
    onSuccess: () => onSuccess('name'),
  });

  return async ({ name }: TFormData) => {
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
          <Stack spacing={3} maxWidth={parseSpacing(11)}>
            <Text fontWeight="bold">Naam van het evenement</Text>
            <FormElement
              flex={2}
              id="event-name"
              Component={
                <Input
                  value={field.value?.nl}
                  placeholder="Naam van event?"
                  onChange={(event) => {
                    field.onChange({
                      nl: (event.target as HTMLInputElement).value,
                    });
                  }}
                  onBlur={(event: FormEvent<HTMLInputElement>) => {
                    field.onChange({
                      nl: (event.target as HTMLInputElement).value,
                    });
                    onChange({ nl: (event.target as HTMLInputElement).value });
                  }}
                />
              }
            />
          </Stack>
        );
      }}
    />
  );
};

const nameStepConfiguration = {
  Component: NameStep,
  field: 'name',
  title: () => 'Basisgegevens',
};

export { nameStepConfiguration, useEditName };
