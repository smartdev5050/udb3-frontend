import { useTranslation } from 'react-i18next';

import { OfferType } from '@/constants/OfferType';
import { SupportedLanguages } from '@/i18n/index';
import { Country } from '@/types/Country';
import { AttendanceMode, Event, isEvent } from '@/types/Event';
import { Place } from '@/types/Place';
import { Values } from '@/types/Values';

import { City } from '../CityPicker';
import { additionalInformationStepConfiguration } from '../steps/AdditionalInformationStep';
import { calendarStepConfiguration } from '../steps/CalendarStep';
import { typeAndThemeStepConfiguration } from '../steps/EventTypeAndThemeStep';
import { locationStepConfiguration } from '../steps/LocationStep';
import { nameAndAgeRangeStepConfiguration } from '../steps/NameAndAgeRangeStep';
import { scopeStepConfiguration } from '../steps/ScopeStep';
import { StepsForm } from '../steps/StepsForm';

type Scope = 'events' | 'places';

type FormData = {
  scope: Scope;
  calendar: any;
  typeAndTheme: {
    type: { id: string; label: string };
    theme: { id: string; label: string };
  };
  location: {
    isOnline: boolean;
    onlineUrl: string;
    municipality: City;
    place: Place;
    country: Country;
  };
  nameAndAgeRange: {
    name: Record<Values<typeof SupportedLanguages>, string>;
    typicalAgeRange: string;
  };
};

const EventForm = () => {
  const { t, i18n } = useTranslation();

  const convertEventToFormData = (event: Event) => {
    const eventAddress =
      event.location.address[i18n.language] ?? event.location.address;
    return {
      scope: isEvent(event) ? OfferType.EVENTS : OfferType.PLACES,
      location: {
        isOnline: event.attendanceMode === AttendanceMode.ONLINE,
        municipality: {
          zip: eventAddress.postalCode,
          label: `${eventAddress.postalCode} ${eventAddress.addressLocality}`,
          name: eventAddress.addressLocality,
        },
        place: event.location,
      },
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
      title={t(`create.title`)}
      convertFormDataToEvent={convertFormDataToEvent}
      convertEventToFormData={convertEventToFormData}
      toastConfiguration={{
        messages: {
          basic_info: t('create.toast.success.basic_info'),
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
        calendarStepConfiguration,
        typeAndThemeStepConfiguration,
        locationStepConfiguration,
        nameAndAgeRangeStepConfiguration,
        additionalInformationStepConfiguration,
      ]}
    />
  );
};

export type { FormData, Scope };
export { EventForm };
