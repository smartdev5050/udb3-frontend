import { Controller } from 'react-hook-form';
import * as yup from 'yup';

import {
  useChangeOfferNameMutation,
  useChangeOfferTypicalAgeRangeMutation,
} from '@/hooks/api/offers';
import { parseSpacing } from '@/ui/Box';
import { Stack } from '@/ui/Stack';

import { AgeRangeStep } from './AgeRangeStep';
import { UseEditArguments } from './hooks/useEditField';
import { NameStep } from './NameStep';
import {
  FormDataUnion,
  getStepProps,
  StepProps,
  StepsConfiguration,
} from './Steps';

const useEditNameAndAgeRange = ({
  scope,
  onSuccess,
  offerId,
  mainLanguage,
}: UseEditArguments) => {
  const changeNameMutation = useChangeOfferNameMutation({
    onSuccess: () => onSuccess('basic_info'),
  });

  const changeTypicalAgeRangeMutation = useChangeOfferTypicalAgeRangeMutation({
    onSuccess: () => onSuccess('basic_info'),
  });

  return async ({ nameAndAgeRange }: FormDataUnion) => {
    const { name, typicalAgeRange } = nameAndAgeRange;

    if (typicalAgeRange) {
      await changeTypicalAgeRangeMutation.mutateAsync({
        eventId: offerId,
        typicalAgeRange,
        scope,
      });
    }

    await changeNameMutation.mutateAsync({
      id: offerId,
      lang: mainLanguage,
      name: name[mainLanguage],
      scope,
    });
  };
};

const NameAndAgeRangeStep = ({ control, name, ...props }: StepProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={() => {
        return (
          <Stack spacing={4} maxWidth={parseSpacing(11)}>
            <NameStep {...getStepProps(props)} name={name} control={control} />
            <AgeRangeStep
              {...getStepProps(props)}
              name={name}
              control={control}
            />
          </Stack>
        );
      }}
    />
  );
};

const nameAndAgeRangeStepConfiguration: StepsConfiguration<'nameAndAgeRange'> =
  {
    Component: NameAndAgeRangeStep,
    name: 'nameAndAgeRange',
    title: ({ t }) => t('create.name_and_age.title'),
    validation: yup.object().shape({
      name: yup.object().shape({}).required(),
      typicalAgeRange: yup.string().required(),
    }),
    shouldShowStep: ({ watch, formState }) => {
      const location = watch('location');

      if (location.isOnline || location.place) {
        return true;
      }

      const isCultuurKuur = !location?.country;

      return (
        isCultuurKuur ||
        (location.municipality?.name &&
          formState.touchedFields.location?.streetAndNumber)
      );
    },
  };

export { nameAndAgeRangeStepConfiguration, useEditNameAndAgeRange };
