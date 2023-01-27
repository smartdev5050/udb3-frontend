import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { CalendarType } from '@/constants/CalendarType';
import { EventTypes } from '@/constants/EventTypes';
import { OfferTypes } from '@/constants/OfferType';
import { SupportedLanguage } from '@/i18n/index';
import { getTerms, parseLocationAttributes } from '@/pages/create/OfferForm';
import {
  additionalInformationStepConfiguration,
  AdditionalInformationStepVariant,
} from '@/pages/steps/AdditionalInformationStep';
import { typeAndThemeStepConfiguration } from '@/pages/steps/EventTypeAndThemeStep';
import { placeStepConfiguration } from '@/pages/steps/PlaceStep';
import { productionStepConfiguration } from '@/pages/steps/ProductionStep';
import { StepsConfiguration } from '@/pages/steps/Steps';
import {
  StepsForm,
  useRerenderTriggerStepsForm,
} from '@/pages/steps/StepsForm';
import {
  convertTimeTableToSubEvents,
  timeTableStepConfiguration,
} from '@/pages/steps/TimeTableStep';
import { Countries } from '@/types/Country';
import { AudienceType, Event } from '@/types/Event';
import type { SubEvent } from '@/types/Offer';
import type { Place } from '@/types/Place';
import type { Production } from '@/types/Production';
import { WorkflowStatusMap } from '@/types/WorkflowStatus';
import { parseOfferId } from '@/utils/parseOfferId';

type FormData = {
  typeAndTheme: {
    type: { id: string; label: string };
    theme: { id: string; label: string };
  };
  timeTable: any;
  location: {
    place: Place;
  };
  production: Production & { customOption?: boolean };
};

const convertSubEventsToTimeTable = (subEvents: SubEvent[] = []) => {
  const dateStart = format(new Date(subEvents[0].startDate), 'dd/MM/yyyy');
  const dateEnd = format(
    new Date(subEvents[subEvents.length - 1].endDate),
    'dd/MM/yyyy',
  );

  const data = subEvents.reduce((acc, subEvent) => {
    const date = new Date(subEvent.startDate);

    const formattedDate = format(date, 'dd/MM/yyyy');
    const formattedTime = format(date, "HH'h'mm'm'");

    const prevData = acc?.[formattedDate] ?? {};
    const insertKey = Math.max(0, Object.keys(prevData).length);

    const values = { ...prevData, [insertKey]: formattedTime };
    return { ...acc, [formattedDate]: values };
  }, {});

  return {
    dateStart,
    dateEnd,
    data,
  };
};

const MovieForm = (props) => {
  const { query } = useRouter();
  const { t, i18n } = useTranslation();

  const offerId = query.offerId || query.eventId || query.placeId;

  const convertOfferToFormData = (event: Event) => {
    return {
      scope: OfferTypes.EVENTS,
      typeAndTheme: {
        theme: event.terms.find((term) => term.domain === 'theme'),
        type: event.terms.find((term) => term.domain === 'eventtype'),
      },
      timeTable: convertSubEventsToTimeTable(event.subEvent),
      production: {
        production_id: event.production?.id,
        name: event.production?.title,
        events: event.production?.otherEvents,
      },
      ...parseLocationAttributes(
        event,
        i18n.language as SupportedLanguage,
        event.mainLanguage,
      ),
    };
  };

  const convertFormDataToOffer = ({
    production,
    typeAndTheme,
    location,
    timeTable,
  }: FormData) => {
    const subEvent = convertTimeTableToSubEvents(timeTable);
    return {
      mainLanguage: 'nl',
      name: production.name,
      calendarType:
        subEvent.length > 1 ? CalendarType.MULTIPLE : CalendarType.SINGLE,
      subEvent,
      location: {
        id: parseOfferId(location.place['@id']),
      },
      workflowStatus: WorkflowStatusMap.DRAFT,
      audienceType: AudienceType.EVERYONE,
      ...getTerms(typeAndTheme),
    };
  };

  const rerenderTrigger = useRerenderTriggerStepsForm();

  return (
    <StepsForm
      {...props}
      key={rerenderTrigger}
      scope={OfferTypes.EVENTS}
      label="udb-filminvoer"
      convertFormDataToOffer={convertFormDataToOffer}
      convertOfferToFormData={convertOfferToFormData}
      title={t(`movies.create.title`)}
      toastConfiguration={{
        messages: {
          calendar: t('movies.create.toast.success.calendar'),
          image: t('movies.create.toast.success.image'),
          description: t('movies.create.toast.success.description'),
          video: t('movies.create.toast.success.video'),
          typeAndTheme: t('movies.create.toast.success.theme'),
          location: t('movies.create.toast.success.location'),
          name: t('movies.create.toast.success.name'),
        },
        title: t('movies.create.toast.success.title'),
      }}
      configurations={[
        {
          name: 'scope',
          defaultValue: OfferTypes.EVENTS,
        } as StepsConfiguration<'scope'>,
        {
          ...typeAndThemeStepConfiguration,
          title: () => t('movies.create.step1.title'),
          defaultValue: {
            type: { id: EventTypes.Film, label: 'Film' },
          },
          stepProps: {
            shouldHideType: true,
          },
        } as StepsConfiguration<'typeAndTheme'>,
        timeTableStepConfiguration,
        {
          ...placeStepConfiguration,
          stepProps: {
            country: Countries.BE,
            terms: [EventTypes.Bioscoop],
            chooseLabel: () => t('movies.create.actions.choose_cinema'),
            placeholderLabel: (t) => t('movies.create.cinema.placeholder'),
          },
        } as StepsConfiguration<'location'>,
        productionStepConfiguration,
        {
          ...additionalInformationStepConfiguration,
          variant: AdditionalInformationStepVariant.MOVIE,
          title: () => t(`movies.create.step5.title`),
          stepProps: {
            offerId,
          },
        },
      ]}
    />
  );
};

export { MovieForm };
export type { FormData };
