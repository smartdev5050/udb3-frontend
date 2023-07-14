import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { URL_REGEX } from '@/constants/Regex';
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
import { Steps, StepsConfiguration } from '@/pages/steps/Steps';
import { Organizer } from '@/types/Organizer';
import { Button, ButtonVariants } from '@/ui/Button';
import { Page } from '@/ui/Page';
import { getLanguageObjectOrFallback } from '@/utils/getLanguageObjectOrFallback';

import { NameAndUrlStep } from './steps/NameAndUrlStep';

const typeAndThemeStepConfiguration: StepsConfiguration<'nameAndUrl'> = {
  Component: NameAndUrlStep,
  name: 'nameAndUrl',
  title: ({ t }) => t('organizers.create.step1.title'),
  shouldShowStep: () => true,
  defaultValue: {
    name: '',
    url: '',
  },
  validation: yup.object({
    name: yup.string().required(),
    url: yup.string().matches(URL_REGEX).required(),
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

  const organizerId = useMemo(
    () => query.organizerId as string,
    [query.organizerId],
  );

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
    { id: organizerId },
    {
      onSuccess: (organizer: Organizer) => {
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

  const onSuccess = () => {
    createOrganizer({
      onSuccess: async (organizerId) =>
        await push(`/organizers/${organizerId}/edit`),
    });
  };

  return (
    <Page>
      <Page.Title spacing={3} alignItems="center">
        {t('organizers.create.title')}
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
          onClick={handleSubmit(onSuccess)}
        >
          {t('organizers.create.step1.save')}
        </Button>
      </Page.Footer>
    </Page>
  );
};

export { OrganizerForm };
