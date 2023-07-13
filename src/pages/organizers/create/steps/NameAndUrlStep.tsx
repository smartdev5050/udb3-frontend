import { Controller } from 'react-hook-form';

import { getStepProps } from '@/pages/steps/Steps';
import { parseSpacing } from '@/ui/Box';
import { Stack } from '@/ui/Stack';

import { NameStep } from './NameStep';
import { UrlStep } from './UrlStep';

const NameAndUrlStep = ({
  control,
  name,
  onChange,
  shouldHideType,
  ...props
}: any) => {
  return (
    <Controller
      name={name}
      control={control}
      render={() => {
        return (
          <Stack spacing={4} maxWidth={parseSpacing(9)}>
            <NameStep {...getStepProps(props)} name={name} control={control} />
            <UrlStep {...getStepProps(props)} name={name} control={control} />
          </Stack>
        );
      }}
    />
  );
};

NameAndUrlStep.defaultProps = {};

export { NameAndUrlStep };
