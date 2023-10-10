import React, { useEffect } from 'react';

import {
  TabContentProps,
  ValidationStatus,
} from '@/pages/steps/AdditionalInformationStep/AdditionalInformationStep';
import { isLocationSet, LocationStep } from '@/pages/steps/LocationStep';
import { StepProps } from '@/pages/steps/Steps';
import { StackProps } from '@/ui/Stack';

type PhysicalLocationStepProps = StackProps & TabContentProps & StepProps;

function PhysicalLocationStep({
  onValidationChange,
  ...props
}: PhysicalLocationStepProps) {
  const location = props.watch('location');

  useEffect(() => {
    onValidationChange(
      location?.streetAndNumber
        ? ValidationStatus.SUCCESS
        : ValidationStatus.WARNING,
    );
  }, [onValidationChange, location]);

  return <LocationStep {...props} onChange={props.onSuccessfulChange} />;
}

export { PhysicalLocationStep };
