import React from 'react';
import { TabContentProps } from '@/pages/steps/AdditionalInformationStep/AdditionalInformationStep';
import { StackProps } from '@/ui/Stack';
import { LocationStep } from '@/pages/steps/LocationStep';
import { StepProps } from '@/pages/steps/Steps';

type PhysicalLocationStepProps = StackProps & TabContentProps & StepProps;

function PhysicalLocationStep({ ...props }: PhysicalLocationStepProps) {
  return (
    <LocationStep
      name={'location'}
      {...props}
      onChange={props.onSuccessfulChange}
    />
  );
}

export { PhysicalLocationStep };
