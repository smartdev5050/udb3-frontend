import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { ScopeTypes } from '@/constants/OfferType';
import { URL_REGEX } from '@/constants/Regex';
import {
  useCreateOrganizerMutation,
  useGetOrganizerByIdQuery,
  useUpdateOrganizerMutation,
} from '@/hooks/api/organizers';
import { SupportedLanguage, SupportedLanguages } from '@/i18n/index';
import { parseLocationAttributes } from '@/pages/create/OfferForm';
import {
  additionalInformationStepConfiguration,
  AdditionalInformationStepVariant,
} from '@/pages/steps/AdditionalInformationStep';
import { useParseStepConfiguration } from '@/pages/steps/hooks/useParseStepConfiguration';
import { locationStepConfiguration } from '@/pages/steps/LocationStep';
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
    shouldShowStep: (form) =>
      form.getValues('nameAndUrl.name') && form.getValues('nameAndUrl.url'),
    variant: AdditionalInformationStepVariant.ORGANIZER,
    name: 'location' as StepsConfiguration['name'],
    defaultValue: locationStepConfiguration.defaultValue,
  },
];

const OrganizerForm = (props) => {
  const scope = ScopeTypes.ORGANIZERS;
  const { form } = useParseStepConfiguration(configurations);
  const { t, i18n } = useTranslation();
  const { push, query } = useRouter();

  const { handleSubmit, formState, getValues, reset } = form;

  const urlOrganizerId = useMemo(
    () => query.organizerId as string,
    [query.organizerId],
  );

  const convertOrganizerToFormData = (organizer: Organizer) => {
    const locationAttributes = !organizer?.address
      ? {}
      : parseLocationAttributes(
          organizer,
          i18n.language as SupportedLanguage,
          organizer.mainLanguage as SupportedLanguage,
        );

    return {
      nameAndUrl: {
        name: getLanguageObjectOrFallback(
          organizer.name,
          i18n.language as SupportedLanguage,
        ) as string,
        url: organizer.url,
      },
      ...locationAttributes,
    };
  };

  // const toast = useToast(toastConfiguration);

  // TODO better type query
  const getOrganizerByIdQuery = useGetOrganizerByIdQuery(
    { id: urlOrganizerId },
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
  const updateOrganizerMutation = useUpdateOrganizerMutation();

  const upsertOrganizer = async ({ onSuccess }) => {
    let mutation = createOrganizerMutation;
    let attributes: { [key: string]: any } = {
      name: getValues('nameAndUrl.name'),
      url: getValues('nameAndUrl.url'),
      mainLanguage: i18n.language,
    };

    if (urlOrganizerId) {
      mutation = updateOrganizerMutation;
      attributes = {
        ...attributes,
        organizerId: urlOrganizerId,
        address: {
          [i18n.language]: {
            addressCountry: getValues('location.country'),
            addressLocality: getValues('location.municipality.name'),
            postalCode: getValues('location.municipality.zip'),
            streetAddress: getValues('location.streetAndNumber'),
          },
        },
      };
    }

    const { organizerId } = await mutation.mutateAsync(attributes);

    onSuccess(organizerId);
  };

  const hasErrors = Object.keys(formState.errors).length > 0;

  const onSuccess = () => {
    upsertOrganizer({
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
          offerId={urlOrganizerId}
          mainLanguage={SupportedLanguages.NL}
          configurations={configurations}
          form={form}
        />
      </Page.Content>
      <Page.Footer>
        {urlOrganizerId ? (
          <Button
            disabled={hasErrors}
            variant={ButtonVariants.PRIMARY}
            onClick={handleSubmit(onSuccess)}
          >
            {t('organizers.create.step2.save')}
          </Button>
        ) : (
          <Button
            disabled={hasErrors || !formState.isDirty}
            variant={ButtonVariants.PRIMARY}
            onClick={handleSubmit(onSuccess)}
          >
            {t('organizers.create.step1.save')}
          </Button>
        )}
      </Page.Footer>
    </Page>
  );
};

export { OrganizerForm };
