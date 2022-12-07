import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { OfferType } from '@/constants/OfferType';
import { SupportedLanguages } from '@/i18n/index';
import { additionalInformationStepConfiguration } from '@/pages/steps/AdditionalInformationStep';
import { calendarStepConfiguration } from '@/pages/steps/CalendarStep';
import { convertStateToFormData } from '@/pages/steps/CalendarStep/CalendarStep';
import { typeAndThemeStepConfiguration } from '@/pages/steps/EventTypeAndThemeStep';
import { locationStepConfiguration } from '@/pages/steps/LocationStep';
import {
  CalendarMachineProvider,
  useCalendarSelector,
} from '@/pages/steps/machines/calendarMachine';
import { nameAndAgeRangeStepConfiguration } from '@/pages/steps/NameAndAgeRangeStep';
import { scopeStepConfiguration } from '@/pages/steps/ScopeStep';
import { StepsForm } from '@/pages/steps/StepsForm';
import { Country } from '@/types/Country';
import { AttendanceMode, Event, isEvent } from '@/types/Event';
import { Place } from '@/types/Place';
import { Values } from '@/types/Values';
import { WorkflowStatusMap } from '@/types/WorkflowStatus';
import { parseOfferId } from '@/utils/parseOfferId';

import { City } from '../CityPicker';

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
    streetAndNumber: string;
    place: Place;
    country: Country;
  };
  nameAndAgeRange: {
    name: Record<Values<typeof SupportedLanguages>, string>;
    typicalAgeRange: string;
  };
};

const ONLINE_LOCATION_ID = '00000000-0000-0000-0000-000000000000';

const EventForm = () => {
  const { t, i18n } = useTranslation();
  const { query } = useRouter();

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

  const getLocationAttributes = (
    location: FormData['location'],
    language: string,
  ) => {
    const {
      country,
      municipality,
      place,
      isOnline,
      streetAndNumber,
      onlineUrl,
    } = location;
    if (place) {
      return {
        location: {
          id: parseOfferId(place['@id']),
        },
      };
    }

    if (isOnline) {
      return {
        location: {
          id: ONLINE_LOCATION_ID,
          onlineUrl,
        },
      };
    }

    return {
      address: {
        [language]: {
          streetAddress: streetAndNumber,
          addressCountry: country,
          municipality,
        },
      },
    };
  };

  const getTerms = (typeAndTheme: FormData['typeAndTheme']) => {
    const { type, theme } = typeAndTheme;
    const terms = [
      type && {
        id: type.id,
        label: type.label,
        domain: 'eventtype',
      },
      theme && {
        id: theme.id,
        label: theme.label,
        domain: 'theme',
      },
    ].filter(Boolean);
    return { terms };
  };

  const convertFormDataToEvent = ({
    nameAndAgeRange: { name, typicalAgeRange },
    typeAndTheme,
    location,
  }: FormData) => {
    return {
      typicalAgeRange,
      mainLanguage: i18n.language,
      name,
      // TODO: Add mixed support
      attendanceMode: location.isOnline
        ? AttendanceMode.ONLINE
        : AttendanceMode.OFFLINE,
      workflowStatus: WorkflowStatusMap.DRAFT,
      audienceType: 'everyone',
      ...getLocationAttributes(location, i18n.language),
      ...getTerms(typeAndTheme),
    };
  };

  const calendarState = useCalendarSelector((state) => state);

  const calendarFormData = useMemo(() => {
    if (!calendarState) return undefined;
    return convertStateToFormData(calendarState);
  }, [calendarState]);

  const convertFormDataWithCalendarToEvent = (formData) => {
    const newFormData = convertFormDataToEvent(formData);

    return {
      ...newFormData,
      ...(calendarFormData && { calendar: calendarFormData }),
    };
  };

  return (
    <StepsForm
      title={t(`create.title`)}
      convertFormDataToEvent={convertFormDataWithCalendarToEvent}
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
        typeAndThemeStepConfiguration,
        {
          ...calendarStepConfiguration,
          stepProps: {
            eventId: query.id || query.eventId,
          },
        },
        locationStepConfiguration,
        nameAndAgeRangeStepConfiguration,
        {
          ...additionalInformationStepConfiguration,
          stepProps: {
            eventId: query.id || query.eventId,
          },
          shouldShowStep: ({ watch }) =>
            !!(query.id || query.eventId) && !!watch('nameAndAgeRange.name'),
        },
      ]}
    />
  );
};

const EventFormWithCalendarMachine = () => (
  <CalendarMachineProvider>
    <EventForm />
  </CalendarMachineProvider>
);

export type { FormData, Scope };
export { EventFormWithCalendarMachine as EventForm };
