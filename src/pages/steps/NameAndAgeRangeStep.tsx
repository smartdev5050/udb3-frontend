import { Controller } from 'react-hook-form';
import * as yup from 'yup';

import {
  useChangeOfferNameMutation,
  useChangeOfferTypicalAgeRangeMutation,
} from '@/hooks/api/offers';
import { parseSpacing } from '@/ui/Box';
import { Stack } from '@/ui/Stack';

import { AgeRangeStep } from './AgeRangeStep';
import { NameStep } from './NameStep';
import {
  FormDataUnion,
  getStepProps,
  StepProps,
  StepsConfiguration,
} from './Steps';

const useEditNameAndAgeRange = ({ scope, onSuccess, offerId }) => {
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
      lang: 'nl',
      name: name.nl,
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
    shouldShowStep: ({ watch }) => {
      const location = watch('location');
      return (
        !!location?.place ||
        location?.isOnline ||
        !!location?.streetAndNumber ||
        !location.country // undefined when cultuurkuur is selected as country
      );
    },
  };

export { nameAndAgeRangeStepConfiguration, useEditNameAndAgeRange };
