import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { OfferTypes } from '@/constants/OfferType';
import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import { SupportedLanguage, SupportedLanguages } from '@/i18n/index';
import {
  additionalInformationStepConfiguration,
  AdditionalInformationStepVariant,
} from '@/pages/steps/AdditionalInformationStep';
import { calendarStepConfiguration } from '@/pages/steps/CalendarStep';
import {
  CalendarInForm,
  convertStateToFormData,
} from '@/pages/steps/CalendarStep/CalendarStep';
import { typeAndThemeStepConfiguration } from '@/pages/steps/EventTypeAndThemeStep';
import { locationStepConfiguration } from '@/pages/steps/LocationStep';
import {
  CalendarMachineProvider,
  useCalendarSelector,
} from '@/pages/steps/machines/calendarMachine';
import { nameAndAgeRangeStepConfiguration } from '@/pages/steps/NameAndAgeRangeStep';
import { scopeStepConfiguration } from '@/pages/steps/ScopeStep';
import {
  StepsForm,
  useRerenderTriggerStepsForm,
} from '@/pages/steps/StepsForm';
import { Address, AddressInternal } from '@/types/Address';
import { Country } from '@/types/Country';
import { AttendanceMode, AudienceType, isEvent } from '@/types/Event';
import { Offer, SubEvent } from '@/types/Offer';
import { isPlace, Place } from '@/types/Place';
import { Values } from '@/types/Values';
import { WorkflowStatusMap } from '@/types/WorkflowStatus';
import { parseSpacing } from '@/ui/Box';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Page } from '@/ui/Page';
import { Paragraph } from '@/ui/Paragraph';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { ToggleBox } from '@/ui/ToggleBox';
import { arrayToValue } from '@/utils/arrayToValue';
import { getLanguageObjectOrFallback } from '@/utils/getLanguageObjectOrFallback';
import { parseOfferId } from '@/utils/parseOfferId';

import { City } from '../CityPicker';
import { useCalendarType } from '../steps/CalendarStep/useCalendarType';
import { FormDataUnion } from '../steps/Steps';

type Scope = 'events' | 'places';

type FormData = {
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
      ...(isEvent(offer) &&
        !!offer.onlineUrl && { onlineUrl: offer.onlineUrl }),
    },
  };
};

const OfferForm = () => {
  const { t, i18n } = useTranslation();
  const { query, asPath, ...router } = useRouter();
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

  const offerId =
    arrayToValue(scope === OfferTypes.EVENTS ? query.eventId : query.placeId) ||
    undefined;

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
      return {
        location: {
          id: parseOfferId(place['@id']),
        },
        ...(scope === OfferTypes.EVENTS && {
          attendanceMode: AttendanceMode.OFFLINE,
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
      ...(scope === OfferTypes.EVENTS && {
        audienceType: AudienceType.EVERYONE,
      }),
      ...getLocationAttributes(scope, location, i18n.language),
      ...getTerms(typeAndTheme),
    };
  };

  const context = useCalendarSelector((state) => state.context);

  const calendarType = useCalendarType();

  const calendarFormData = useMemo(() => {
    if (!context || !calendarType) return undefined;
    return convertStateToFormData(context, calendarType);
  }, [context, calendarType]);

  const convertFormDataWithCalendarToOffer = (formData: any) => {
    const newFormData = convertFormDataToOffer(formData);

    return {
      ...newFormData,
      ...calendarFormData,
    };
  };

  const rerenderTrigger = useRerenderTriggerStepsForm();

  return (
    <StepsForm
      key={rerenderTrigger}
      title={t(`create.title`)}
      scope={scope}
      convertFormDataToOffer={convertFormDataWithCalendarToOffer}
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

const OfferFormWithCalendarMachine = () => {
  const { cookies } = useCookiesWithOptions(['has_seen_beta_conversion_page']);

  const has_seen_beta_conversion_page =
    cookies?.['has_seen_beta_conversion_page'];

  if (!has_seen_beta_conversion_page) {
    return (
      <Page>
        <Page.Title>
          Wil jij de beta-versie van UiTdatabank proberen?
        </Page.Title>
        <Page.Content spacing={5}>
          <Stack>
            <Paragraph>
              Wij zijn altijd druk bezig met de ontwikkeling van UiTdatabank.
              Met de beta-versie van UiTdatabank kan jij genieten van de
              nieuwste features en verbeterde gebruikersinterface.
            </Paragraph>
            <Paragraph>
              Ben je geïnteresseerd om een van de eersten te zijn die onze
              nieuwe features gebruikt? Klik dan op {'"Probeer nu"'}. Je kan
              steeds terug naar de normale UI via de toggle in de menubar.
            </Paragraph>
          </Stack>
          <Inline spacing={5} alignItems="center" maxWidth={parseSpacing(9)}>
            <ToggleBox
              // onClick={onChooseOneOrMoreDays}
              // active={isOneOrMoreDays}
              // icon={<IconOneOrMoreDays />}
              icon={<Icon name={Icons.SIGN_OUT} />}
              text="Liever niet"
              minHeight={parseSpacing(7)}
              flex={1}
            />
            <ToggleBox
              // onClick={onChooseFixedDays}
              // active={isFixedDays}
              icon={<Icon name={Icons.CHECK} />}
              text="Probeer nu"
              minHeight={parseSpacing(7)}
              flex={1}
              // disabled={disableChooseFixedDays}
            />
          </Inline>
        </Page.Content>
      </Page>
    );
  }

  return (
    <CalendarMachineProvider>
      <OfferForm />
    </CalendarMachineProvider>
  );
};

export type { FormData, Scope };
export {
  getTerms,
  OfferFormWithCalendarMachine as OfferForm,
  parseLocationAttributes,
};
