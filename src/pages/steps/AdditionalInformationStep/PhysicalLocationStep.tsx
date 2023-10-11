import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useChangeLocationMutation } from '@/hooks/api/organizers';
import {
  TabContentProps,
  ValidationStatus,
} from '@/pages/steps/AdditionalInformationStep/AdditionalInformationStep';
import { LocationStep } from '@/pages/steps/LocationStep';
import { StepProps } from '@/pages/steps/Steps';
import { StackProps } from '@/ui/Stack';

type PhysicalLocationStepProps = StackProps & TabContentProps & StepProps;

function PhysicalLocationStep({
  onValidationChange,
  ...props
}: PhysicalLocationStepProps) {
  const location = props.watch('location');
  const changeLocation = useChangeLocationMutation();
  const { i18n } = useTranslation();

  useEffect(() => {
    onValidationChange(
      location?.streetAndNumber
        ? ValidationStatus.SUCCESS
        : ValidationStatus.WARNING,
    );
  }, [onValidationChange, location]);

  const onChange = (updatedLocation: typeof location) => {
    props.onSuccessfulChange(updatedLocation);
    if (!updatedLocation.streetAndNumber) {
      return;
    }

    changeLocation.mutate({
      organizerId: props.offerId,
      language: i18n.language,
      location: {
        addressCountry: updatedLocation?.country,
        addressLocality: updatedLocation?.municipality?.name,
        postalCode: updatedLocation?.municipality?.zip,
        streetAddress: updatedLocation?.streetAndNumber,
      },
    });
  };

  return <LocationStep {...props} onChange={onChange} />;
}

export { PhysicalLocationStep };
