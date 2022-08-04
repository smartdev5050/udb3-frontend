import { useTranslation } from 'react-i18next';

import { Event } from '@/types/Event';

import { additionalInformationStepConfiguration } from '../steps/AdditionalInformationStep';
import { typeAndThemeStepConfiguration } from '../steps/EventTypeAndThemeStep';
import { nameAndAgeRangeStepConfiguration } from '../steps/NameAndAgeRangeStep';
import { scopeStepConfiguration } from '../steps/ScopeStep';
import { StepsForm } from '../steps/StepsForm';

type Scope = 'events' | 'places';

type FormData = {
  scope: Scope;
  typeAndTheme: {
    type: { id: string; label: string };
    theme: { id: string; label: string };
  };
  nameAndAgeRange: {
    name: {
      nl: string;
    };
    typicalAgeRange: string;
  };
};

const EventForm = () => {
  const { t } = useTranslation();

  const convertEventToFormData = (event: Event) => {
    return {
      typeAndTheme: {
        theme: event.terms.find((term) => term.domain === 'theme'),
        type: event.terms.find((term) => term.domain === 'eventtype'),
      },
      nameAndAgeRange: {
        name: event.name,
        typicalAgeRange: event.typicalAgeRange,
      },
    };
  };

  const convertFormDataToEvent = ({
    nameAndAgeRange: { name, typicalAgeRange },
  }: FormData) => {
    return {
      name,
      typicalAgeRange,
    };
  };

  return (
    <StepsForm
      title={t(`event.create.title`)}
      convertFormDataToEvent={convertFormDataToEvent}
      convertEventToFormData={convertEventToFormData}
      toastConfiguration={{
        messages: {
          media: t('create.toast.success.media'),
          booking_info: t('create.toast.success.booking_info'),
          contact_info: t('create.toast.success.contact_info'),
          description: t('create.toast.success.description'),
          audience: t('create.toast.success.audience'),
          price_info: t('create.toast.success.price_info'),
          organizer: t('create.toast.success.organizer'),
        },
        title: '',
      }}
      configurations={[
        scopeStepConfiguration,
        typeAndThemeStepConfiguration,
        nameAndAgeRangeStepConfiguration,
        additionalInformationStepConfiguration,
      ]}
    />
  );
};

export type { FormData, Scope };
export { EventForm };
