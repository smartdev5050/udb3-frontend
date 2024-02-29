import { useRouter } from 'next/router';
import { Controller } from 'react-hook-form';
import * as yup from 'yup';

import {
  useChangeOfferNameMutation,
  useChangeOfferTypicalAgeRangeMutation,
} from '@/hooks/api/offers';
import { isLocationSet } from '@/pages/steps/LocationStep';
import { Place } from '@/types/Place';
import { AlertVariants } from '@/ui/Alert';
import { parseSpacing } from '@/ui/Box';
import { Stack } from '@/ui/Stack';
import { DuplicatePlaceErrorBody } from '@/utils/fetchFromApi';
import { parseOfferId } from '@/utils/parseOfferId';

import { AlertDuplicatePlace } from '../AlertDuplicatePlace';
import { AgeRangeStep } from './AgeRangeStep';
import { UseEditArguments } from './hooks/useEditField';
import { NameStep } from './NameStep';
import {
  FormDataUnion,
  getStepProps,
  StepProps,
  StepsConfiguration,
} from './Steps';

const numberHyphenNumberRegex = /^(\d*-)?\d*$/;

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

const NameAndAgeRangeStep = ({ control, name, error, ...props }: StepProps) => {
  const router = useRouter();

  const duplicatePlaceId = (error?.body as DuplicatePlaceErrorBody)
    ? parseOfferId(error.body.duplicatePlaceUri)
    : undefined;

  const goToLocationDetailPage = (place: Place) => {
    const placeId = parseOfferId(place['@id']);
    router.push(`/places/${placeId}/preview`);
  };

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
            <AlertDuplicatePlace
              variant={AlertVariants.DANGER}
              placeId={duplicatePlaceId}
              labelKey="create.name_and_age.name.duplicate_place"
              onSelectPlace={goToLocationDetailPage}
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
      typicalAgeRange: yup.string().matches(numberHyphenNumberRegex).required(),
    }),
    shouldShowStep: ({ watch, formState }) => {
      const location = watch('location');
      const scope = watch('scope');

      return isLocationSet(scope, location, formState);
    },
  };

export { nameAndAgeRangeStepConfiguration, useEditNameAndAgeRange };
