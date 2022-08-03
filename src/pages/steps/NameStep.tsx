import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { parseSpacing } from '@/ui/Box';
import { Inline } from '@/ui/Inline';

import { FormDataIntersection, StepProps } from './Steps';

const NameStep = <TFormData extends FormDataIntersection>({
  control,
  field,
}: StepProps<TFormData>) => {
  const { t } = useTranslation();

  return (
    <Controller<TFormData>
      control={control}
      name={field}
      render={({ field }) => {
        return (
          <Inline spacing={5} alignItems="center" maxWidth={parseSpacing(11)}>
            <p>Name step</p>
          </Inline>
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

export { NameStep, nameStepConfiguration };
