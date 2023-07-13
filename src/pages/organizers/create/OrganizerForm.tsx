import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import {
  useCreateOrganizerMutation,
  useGetOrganizerByIdQuery,
} from '@/hooks/api/organizers';
import { SupportedLanguage, SupportedLanguages } from '@/i18n/index';
import {
  additionalInformationStepConfiguration,
  AdditionalInformationStepVariant,
} from '@/pages/steps/AdditionalInformationStep';
import { useParseStepConfiguration } from '@/pages/steps/hooks/useParseStepConfiguration';
import { getStepProps, Steps, StepsConfiguration } from '@/pages/steps/Steps';
import { Organizer } from '@/types/Organizer';
import { parseSpacing } from '@/ui/Box';
import { Button, ButtonVariants } from '@/ui/Button';
import { Page } from '@/ui/Page';
import { Stack } from '@/ui/Stack';
import { getLanguageObjectOrFallback } from '@/utils/getLanguageObjectOrFallback';

import { NameStep } from './steps/NameStep';
import { UrlStep } from './steps/UrlStep';

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

const OrganizerForm = (props) => {
  const scope = 'organizers';
  const { form } = useParseStepConfiguration(configurations);
  const { t, i18n } = useTranslation();
  const { push, query } = useRouter();

  const { handleSubmit, formState, getValues, reset } = form;

  const organizerId = useMemo(() => query.organizerId, [query.organizerId]);

  const convertOrganizerToFormData = (organizer: Organizer) => {
    return {
      nameAndUrl: {
        name: getLanguageObjectOrFallback(
          organizer.name,
          i18n.language as SupportedLanguage,
        ) as string,
        url: organizer.url,
      },
    };
  };

  // const toast = useToast(toastConfiguration);

  // TODO better type query
  const getOrganizerByIdQuery = useGetOrganizerByIdQuery(
    // @ts-expect-error
    { id: organizerId },
    {
      onSuccess: (organizer: Organizer) => {
        console.log('in on success');
        reset(convertOrganizerToFormData(organizer), {
          keepDirty: true,
        });
      },
    },
  );

  // @ts-expect-error
  const organizer = getOrganizerByIdQuery?.data;

  const createOrganizerMutation = useCreateOrganizerMutation();

  const createOrganizer = async ({ onSuccess }) => {
    const { organizerId } = await createOrganizerMutation.mutateAsync({
      name: getValues('nameAndUrl.name'),
      url: getValues('nameAndUrl.url'),
      mainLanguage: i18n.language,
    });

    onSuccess(organizerId);
  };

  const hasErrors = Object.keys(formState.errors).length > 0;

  return (
    <Page>
      <Page.Title spacing={3} alignItems="center">
        Organisatie toevoegen
      </Page.Title>
      <Page.Content spacing={5} alignItems="flex-start">
        <Steps
          scope={scope}
          offerId={organizerId}
          mainLanguage={SupportedLanguages.NL}
          configurations={configurations}
          onChangeSuccess={() => ({})}
          form={form}
        />
      </Page.Content>
      <Page.Footer>
        <Button
          disabled={hasErrors || !formState.isDirty}
          variant={ButtonVariants.PRIMARY}
          onClick={() =>
            createOrganizer({
              onSuccess: async (organizerId) =>
                await push(`/organizers/${organizerId}/edit`),
            })
          }
        >
          {t('create.actions.publish')}
        </Button>
      </Page.Footer>
    </Page>
  );
};

export { OrganizerForm };
