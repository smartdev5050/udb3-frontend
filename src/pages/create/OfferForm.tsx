import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { CalendarType } from '@/constants/CalendarType';
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
import { Offer } from '@/types/Offer';
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

const OfferForm = () => {
  const { t, i18n } = useTranslation();
  const { query } = useRouter();

  const parseLocationAttributes = (offer: Event | Place) => {
    const eventAddress = isEvent(offer)
      ? offer.location.address[i18n.language] ?? offer.location.address
      : offer.address[i18n.language];

    const isOnline =
      isEvent(offer) && offer.attendanceMode === AttendanceMode.ONLINE;

    const country = isEvent(offer)
      ? offer.location.address[i18n.language].addressCountry
      : offer.address[i18n.language].addressCountry;

    return {
      location: {
        isOnline,
        municipality: {
          zip: eventAddress.postalCode,
          label: `${eventAddress.postalCode} ${eventAddress.addressLocality}`,
          name: eventAddress.addressLocality,
        },
        place: isEvent(offer) ? offer.location : undefined,
        country,
      },
    };
  };

  const convertOfferToFormData = (offer: Offer) => {
    return {
      scope: isEvent(offer) ? OfferType.EVENTS : OfferType.PLACES,
      ...parseLocationAttributes(offer),
      typeAndTheme: {
        theme: offer.terms.find((term) => term.domain === 'theme'),
        type: offer.terms.find((term) => term.domain === 'eventtype'),
      },
      nameAndAgeRange: {
        name: offer.name,
        typicalAgeRange: offer.typicalAgeRange,
      },
    };
  };

  const getLocationAttributes = (
    scope: FormData['scope'],
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
        ...(scope === OfferType.EVENTS && {
          attendanceMode: AttendanceMode.OFFLINE,
        }),
      };
    }

    // isOnline can only be true on an event
    if (isOnline) {
      return {
        attendanceMode: AttendanceMode.ONLINE,
        onlineUrl,
      };
    }

    return {
      address: {
        [language]: {
          streetAddress: streetAndNumber,
          addressCountry: country,
          addressLocality: municipality.name,
          postalCode: municipality.zip,
        },
      },
    };
  };

  const getTerms = (typeAndTheme: FormData['typeAndTheme']) => {
    const { type, theme } = typeAndTheme;

    const terms = [
      type && {
        id: type.id,
      },
      theme && {
        id: theme.id,
      },
    ].filter(Boolean);

    return { terms };
  };

  const convertFormDataToOffer = ({
    scope,
    nameAndAgeRange: { name, typicalAgeRange },
    typeAndTheme,
    location,
  }: FormData) => {
    return {
      typicalAgeRange,
      mainLanguage: i18n.language,
      name,
      workflowStatus: WorkflowStatusMap.DRAFT,
      ...(scope === OfferType.EVENTS && { audienceType: 'everyone' }),
      ...getLocationAttributes(scope, location, i18n.language),
      ...getTerms(typeAndTheme),
    };
  };

  const calendarState = useCalendarSelector((state) => state);

  const calendarFormData = useMemo(() => {
    if (!calendarState) return undefined;
    return convertStateToFormData(calendarState);
  }, [calendarState]);

  const convertFormDataWithCalendarToOffer = (formData: any) => {
    const newFormData = convertFormDataToOffer(formData);

    return {
      ...newFormData,
      ...calendarFormData,
    };
  };

  return (
    <StepsForm
      title={t(`create.title`)}
      convertFormDataToOffer={convertFormDataWithCalendarToOffer}
      convertOfferToFormData={convertOfferToFormData}
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

const OfferFormWithCalendarMachine = () => (
  <CalendarMachineProvider>
    <OfferForm />
  </CalendarMachineProvider>
);

export type { FormData, Scope };
export { OfferFormWithCalendarMachine as OfferForm };
