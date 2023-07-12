import { Controller } from 'react-hook-form';
import * as yup from 'yup';

import { SupportedLanguages } from '@/i18n/index';
import { useParseStepConfiguration } from '@/pages/steps/hooks/useParseStepConfiguration';
import { getStepProps, Steps, StepsConfiguration } from '@/pages/steps/Steps';
import { parseSpacing } from '@/ui/Box';
import { Page } from '@/ui/Page';
import { Stack } from '@/ui/Stack';

import { NameStep } from './steps/NameStep';
import { UrlStep } from './steps/UrlStep';
import {
  additionalInformationStepConfiguration,
  AdditionalInformationStepVariant,
} from '@/pages/steps/AdditionalInformationStep';

const NameAndUrlStep = ({
  control,
  name,
  onChange,
  shouldHideType,
  ...props
}: any) => {
  console.log({ props });

  console.log({ control });

  return (
    <Controller
      name={name}
      control={control}
      render={() => {
        return (
          <Stack spacing={4} maxWidth={parseSpacing(11)}>
            <NameStep {...getStepProps(props)} name={name} control={control} />
            <UrlStep {...getStepProps(props)} name={name} control={control} />
          </Stack>
        );
      }}
    />
  );
};

NameAndUrlStep.defaultProps = {};

const typeAndThemeStepConfiguration: StepsConfiguration<'nameAndUrl'> = {
  Component: NameAndUrlStep,
  name: 'nameAndUrl',
  title: () => 'Welke organisatie wil je toevoegen?',
  shouldShowStep: () => true,
  defaultValue: {
    name: '',
    url: '',
  },
  validation: yup.object({
    name: yup.string().required(),
    url: yup.string().required(),
  }),
};

const configurations = [
  typeAndThemeStepConfiguration,
  {
    ...additionalInformationStepConfiguration,
    shouldShowStep: () => true,
    variant: AdditionalInformationStepVariant.ORGANIZER,
  },
];

const OrganizerForm = () => {
  const { form } = useParseStepConfiguration(configurations);

  return (
    <Page>
      <Page.Title spacing={3} alignItems="center">
        Organisatie toevoegen
      </Page.Title>
      <Page.Content spacing={5} alignItems="flex-start">
        <Steps
          mainLanguage={SupportedLanguages.NL}
          configurations={configurations}
          form={form}
        />
      </Page.Content>
    </Page>
  );
};

export { OrganizerForm };
