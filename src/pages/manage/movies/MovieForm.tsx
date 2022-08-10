import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { CalendarType } from '@/constants/CalendarType';
import { EventTypes } from '@/constants/EventTypes';
import { OfferType } from '@/constants/OfferType';
import {
  additionalInformationStepConfiguration,
  AdditionalInformationStepVariant,
} from '@/pages/steps/AdditionalInformationStep';
import { typeAndThemeStepConfiguration } from '@/pages/steps/EventTypeAndThemeStep';
import { placeStepConfiguration } from '@/pages/steps/PlaceStep';
import { productionStepConfiguration } from '@/pages/steps/ProductionStep';
import { StepsForm } from '@/pages/steps/StepsForm';
import {
  convertTimeTableToSubEvents,
  timeTableStepConfiguration,
} from '@/pages/steps/TimeTableStep';
import type { Event } from '@/types/Event';
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
  place: Place;
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
  const router = useRouter();
  const parts = router.pathname.split('/');
  const { t } = useTranslation();

  const convertEventToFormData = (event: Event) => {
    return {
      typeAndTheme: {
        theme: event.terms.find((term) => term.domain === 'theme'),
        type: event.terms.find((term) => term.domain === 'eventtype'),
      },
      place: event.location,
      timeTable: convertSubEventsToTimeTable(event.subEvent),
      production: {
        production_id: event.production?.id,
        name: event.production?.title,
        events: event.production?.otherEvents,
      },
    };
  };

  const convertFormDataToEvent = ({
    production,
    typeAndTheme: { type, theme },
    place,
    timeTable,
  }: FormData) => {
    return {
      mainLanguage: 'nl',
      name: production.name,
      calendar: {
        calendarType: CalendarType.MULTIPLE,
        timeSpans: convertTimeTableToSubEvents(timeTable),
      },
      type: {
        id: type?.id,
        label: type?.label,
        domain: 'eventtype',
      },
      ...(theme && {
        theme: {
          id: theme?.id,
          label: theme?.label,
          domain: 'theme',
        },
      }),
      location: {
        id: parseOfferId(place['@id']),
      },
      workflowStatus: WorkflowStatusMap.DRAFT,
      audienceType: 'everyone',
    };
  };

  return (
    <StepsForm
      {...props}
      key={parts[parts.length - 1]} // needed to re-render the form between create and edit.
      label="udb-filminvoer"
      convertFormDataToEvent={convertFormDataToEvent}
      convertEventToFormData={convertEventToFormData}
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
        { field: 'scope', defaultValue: OfferType.EVENTS },
        {
          ...typeAndThemeStepConfiguration,
          title: () => t('movies.create.step1.title'),
          defaultValue: { type: { id: EventTypes.Film, label: 'Film' } },
          stepProps: {
            shouldHideType: true,
          },
        },
        timeTableStepConfiguration,
        {
          ...placeStepConfiguration,
          stepProps: {
            terms: [EventTypes.Bioscoop],
          },
        },
        productionStepConfiguration,
        {
          ...additionalInformationStepConfiguration,
          variant: AdditionalInformationStepVariant.MINIMAL,
          title: () => t(`movies.create.step5.title`),
        },
      ]}
    />
  );
};

export { MovieForm };
export type { FormData };
