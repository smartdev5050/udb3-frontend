import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { OfferTypes } from '@/constants/OfferType';
import { SupportedLanguage, SupportedLanguages } from '@/i18n/index';
import {
  additionalInformationStepConfiguration,
  AdditionalInformationStepVariant,
} from '@/pages/steps/AdditionalInformationStep';
import { calendarStepConfiguration } from '@/pages/steps/CalendarStep';
import { CalendarInForm } from '@/pages/steps/CalendarStep/CalendarStep';
import { typeAndThemeStepConfiguration } from '@/pages/steps/EventTypeAndThemeStep';
import { locationStepConfiguration } from '@/pages/steps/LocationStep';
import { CalendarMachineProvider } from '@/pages/steps/machines/calendarMachine';
import { nameAndAgeRangeStepConfiguration } from '@/pages/steps/NameAndAgeRangeStep';
import { scopeStepConfiguration } from '@/pages/steps/ScopeStep';
import {
  StepsForm,
  useRerenderTriggerStepsForm,
} from '@/pages/steps/StepsForm';
import { Address, AddressInternal } from '@/types/Address';
import { ContactPoint } from '@/types/ContactPoint';
import { Country } from '@/types/Country';
import { AttendanceMode, AudienceType, isEvent } from '@/types/Event';
import {
  BookingInfo,
  Label,
  MediaObject,
  Offer,
  PriceInfo,
} from '@/types/Offer';
import { Organizer } from '@/types/Organizer';
import { isPlace, Place } from '@/types/Place';
import { Values } from '@/types/Values';
import { WorkflowStatus } from '@/types/WorkflowStatus';
import { getLanguageObjectOrFallback } from '@/utils/getLanguageObjectOrFallback';
import { parseOfferId } from '@/utils/parseOfferId';

import { City } from '../CityPicker';
import { FormDataUnion } from '../steps/Steps';
import { Video } from '../VideoUploadBox';

type Scope = 'events' | 'places';

type FormData = {
  description?: any;
  scope: Scope;
  calendar: CalendarInForm;
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
  mediaObject?: MediaObject[];
  bookingInfo?: BookingInfo;
  priceInfo?: PriceInfo;
  contactPoint?: ContactPoint;
  organizer?: Organizer;
  videos?: Video[];
  labels?: string[];
  hiddenLabels?: string[];
  audience?: {
    audienceType: string;
  };
};

const ONLINE_LOCATION_ID = '00000000-0000-0000-0000-000000000000';

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
      postalCode: postalCode,
      place: isEvent(offer) ? offer.location : undefined,
      country: addressCountry,
      ...(isPlace(offer) && { streetAndNumber: streetAddress }),
      ...(isEvent(offer) &&
        !!offer.onlineUrl && { onlineUrl: offer.onlineUrl }),
    },
  };
};

const OfferForm = () => {
  const { t, i18n } = useTranslation();
  const { query, asPath } = useRouter();
  const { publicRuntimeConfig } = getConfig();

  const scope = useMemo(() => {
    if (
      asPath.startsWith('/events') ||
      asPath.startsWith('/manage/movies') ||
      query.scope === OfferTypes.EVENTS
    ) {
      return OfferTypes.EVENTS;
    }

    if (asPath.startsWith('/places') || query.scope === OfferTypes.PLACES) {
      return OfferTypes.PLACES;
    }

    return undefined;
  }, [asPath, query.scope]);

  const convertOfferToFormData = (offer: Offer) => {
    return {
      scope: isEvent(offer) ? OfferTypes.EVENTS : OfferTypes.PLACES,
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
      const locationId = parseOfferId(place['@id']);

      return {
        location: {
          id: locationId,
        },
        ...(scope === OfferTypes.EVENTS && {
          attendanceMode:
            locationId === ONLINE_LOCATION_ID
              ? AttendanceMode.ONLINE
              : AttendanceMode.OFFLINE,
        }),
      };
    }

    // isOnline can only be true on an event
    if (isOnline) {
      return {
        attendanceMode: AttendanceMode.ONLINE,
        ...(onlineUrl && { onlineUrl }),
      };
    }

    // country is undefined cultuurkuur event
    // Add dummy location
    if (!country) {
      return {
        location: {
          id: publicRuntimeConfig.cultuurKuurLocationId,
        },
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
    description,
    scope,
    nameAndAgeRange: { name, typicalAgeRange },
    typeAndTheme,
    location,
    calendar,
    mediaObject,
    contactPoint,
    bookingInfo,
    priceInfo,
    organizer,
    videos,
    labels,
    hiddenLabels,
    audience,
  }: FormData) => {
    const audienceType =
      location.country && scope === OfferTypes.EVENTS
        ? AudienceType.EVERYONE
        : undefined;

    return {
      description,
      mediaObject,
      contactPoint,
      bookingInfo,
      priceInfo,
      organizer,
      videos,
      typicalAgeRange,
      mainLanguage: i18n.language,
      name,
      labels,
      hiddenLabels,
      workflowStatus: WorkflowStatus.DRAFT,
      ...(audienceType && {
        audienceType: AudienceType.EVERYONE,
      }),
      audience,
      ...getLocationAttributes(scope, location, i18n.language),
      ...getTerms(typeAndTheme),
      ...calendar,
    };
  };

  const rerenderTrigger = useRerenderTriggerStepsForm();

  return (
    <StepsForm
      key={rerenderTrigger}
      title={t(`create.title`)}
      scope={scope}
      convertFormDataToOffer={convertFormDataToOffer}
      convertOfferToFormData={convertOfferToFormData}
      toastConfiguration={{
        messages: {
          basic_info: t('create.toast.success.basic_info'),
          calendar: t('create.toast.success.calendar'),
          media: t('create.toast.success.media'),
          booking_info: t('create.toast.success.booking_info'),
          contact_info: t('create.toast.success.contact_info'),
          description: t('create.toast.success.description'),
          audience: t('create.toast.success.audience'),
          price_info: t('create.toast.success.price_info'),
          organizer: t('create.toast.success.organizer'),
        },
      }}
      configurations={[
        scopeStepConfiguration,
        typeAndThemeStepConfiguration,
        calendarStepConfiguration,
        locationStepConfiguration,
        nameAndAgeRangeStepConfiguration,
        {
          ...additionalInformationStepConfiguration,
          variant:
            scope === OfferTypes.EVENTS
              ? AdditionalInformationStepVariant.EVENT
              : AdditionalInformationStepVariant.PLACE,
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
