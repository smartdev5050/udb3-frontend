import React from 'react';

import { TabContentProps } from '@/pages/steps/AdditionalInformationStep/AdditionalInformationStep';
import { LocationStep } from '@/pages/steps/LocationStep';
import { StepProps } from '@/pages/steps/Steps';
import { StackProps } from '@/ui/Stack';

type PhysicalLocationStepProps = StackProps & TabContentProps & StepProps;

function PhysicalLocationStep({ ...props }: PhysicalLocationStepProps) {
  return <LocationStep {...props} onChange={props.onSuccessfulChange} />;
}

export { PhysicalLocationStep };
