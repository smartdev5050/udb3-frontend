import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { OfferType } from '@/constants/OfferType';
import { SupportedLanguage, SupportedLanguages } from '@/i18n/index';
import {
  additionalInformationStepConfiguration,
  AdditionalInformationStepVariant,
} from '@/pages/steps/AdditionalInformationStep';
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
import { Address, AddressInternal } from '@/types/Address';
import { Country } from '@/types/Country';
import { AttendanceMode, Event, isEvent } from '@/types/Event';
import { Offer } from '@/types/Offer';
import { isPlace, Place } from '@/types/Place';
import { Values } from '@/types/Values';
import { WorkflowStatusMap } from '@/types/WorkflowStatus';
import { getLanguageObjectOrFallback } from '@/utils/getLanguageObjectOrFallback';
import { parseOfferId } from '@/utils/parseOfferId';

import { City } from '../CityPicker';
import { FormDataUnion } from '../steps/Steps';

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

const getTerms = (typeAndTheme: FormDataUnion['typeAndTheme']) => {
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

const getAddress = (
  address: Address,
  language: SupportedLanguage,
  mainLanguage: SupportedLanguage,
) => {
  return getLanguageObjectOrFallback<AddressInternal>(
    address,
    language,
    mainLanguage,
  );
};

const parseLocationAttributes = (
  offer: Offer,
  language: SupportedLanguage,
  mainLanguage: SupportedLanguage,
) => {
  const { addressCountry, addressLocality, postalCode, streetAddress } =
    getAddress(
      isEvent(offer) ? offer.location.address : offer.address,
      language,
      mainLanguage,
    );

  const isOnline =
    isEvent(offer) && offer.attendanceMode === AttendanceMode.ONLINE;

  return {
    location: {
      isOnline,
      municipality: {
        zip: postalCode,
        label: `${postalCode} ${addressLocality}`,
        name: addressLocality,
      },
      place: isEvent(offer) ? offer.location : undefined,
      country: addressCountry,
      ...(isPlace(offer) && { streetAndNumber: streetAddress }),
    },
  };
};

const OfferForm = () => {
  const { t, i18n } = useTranslation();
  const { query, pathname } = useRouter();
  const parts = pathname.split('/');

  const offerId = query.offerId || query.eventId || query.placeId;

  const scope = useMemo(() => {
    if (pathname.startsWith('/events')) {
      return OfferType.EVENTS;
    }

    if (pathname.startsWith('/places')) {
      return OfferType.PLACES;
    }

    return undefined;
  }, [pathname]);

  const convertOfferToFormData = (offer: Offer) => {
    return {
      scope: isEvent(offer) ? OfferType.EVENTS : OfferType.PLACES,
      ...parseLocationAttributes(
        offer,
        i18n.language as SupportedLanguage,
        offer.mainLanguage,
      ),
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
      key={parts[parts.length - 1]} // needed to re-render the form between create and edit.
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
        {
          ...scopeStepConfiguration,
          stepProps: {
            offerId,
          },
        },
        typeAndThemeStepConfiguration,
        {
          ...calendarStepConfiguration,
          stepProps: {
            offerId,
          },
        },
        locationStepConfiguration,
        nameAndAgeRangeStepConfiguration,
        {
          ...additionalInformationStepConfiguration,
          variant:
            scope === OfferType.EVENTS
              ? AdditionalInformationStepVariant.EVENT
              : AdditionalInformationStepVariant.PLACE,
          stepProps: {
            offerId,
          },
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
export {
  getTerms,
  OfferFormWithCalendarMachine as OfferForm,
  parseLocationAttributes,
};
