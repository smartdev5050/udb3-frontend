import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import * as yup from 'yup';

import { CalendarType } from '@/constants/CalendarType';
import { EventTypes } from '@/constants/EventTypes';
import { Steps } from '@/pages/Steps';
import {
  additionalInformationStepConfiguration,
  AdditionalInformationStepVariant,
} from '@/pages/steps/AdditionalInformationStep';
import { eventTypeAndThemeStepConfiguration } from '@/pages/steps/EventTypeAndThemeStep';
import { PublishLaterModal } from '@/pages/steps/modals/PublishLaterModal';
import { placeStepConfiguration } from '@/pages/steps/PlaceStep';
import { productionStepConfiguration } from '@/pages/steps/ProductionStep';
import {
  convertTimeTableToSubEvents,
  timeTableStepConfiguration,
} from '@/pages/steps/TimeTableStep';
import type { Event } from '@/types/Event';
import type { SubEvent } from '@/types/Offer';
import type { Place } from '@/types/Place';
import type { Production } from '@/types/Production';
import { WorkflowStatusMap } from '@/types/WorkflowStatus';
import { Button, ButtonVariants } from '@/ui/Button';
import { Inline } from '@/ui/Inline';
import { Link, LinkVariants } from '@/ui/Link';
import { Page } from '@/ui/Page';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { Toast } from '@/ui/Toast';
import { parseOfferId } from '@/utils/parseOfferId';

import { useAddEvent } from './useAddEvent';
import { useEditField } from './useEditField';
import { useGetEvent } from './useGetEvent';
import { usePublishEvent } from './usePublishEvent';
import { useToast } from './useToast';

type FormData = {
  eventTypeAndTheme: {
    eventType: { id: string; label: string };
    theme: { id: string; label: string };
  };
  timeTable: any;
  place: Place;
  production: Production & { customOption?: boolean };
};

const getValue = getValueFromTheme('createPage');

const FooterStatus = {
  HIDDEN: 'HIDDEN',
  PUBLISH: 'PUBLISH',
  MANUAL_SAVE: 'MANUAL_SAVE',
  AUTO_SAVE: 'AUTO_SAVE',
} as const;

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

const useFooterStatus = ({ event, form }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    formState: { dirtyFields },
  } = form;

  const isMutating = queryClient.isMutating();
  const fetchedEventId = event?.['@id'];
  const availableFrom = event?.availableFrom;
  const isPlaceDirty = dirtyFields.place;

  const footerStatus = useMemo(() => {
    if (fetchedEventId && !availableFrom) {
      return FooterStatus.PUBLISH;
    }
    if (router.route.includes('edit')) return FooterStatus.AUTO_SAVE;
    if (isMutating) return FooterStatus.HIDDEN;
    if (isPlaceDirty) return FooterStatus.MANUAL_SAVE;
    return FooterStatus.HIDDEN;
  }, [fetchedEventId, availableFrom, isPlaceDirty, isMutating, router.route]);

  // scroll effect
  useEffect(() => {
    if (footerStatus !== FooterStatus.HIDDEN) {
      const main = document.querySelector('main');
      main.scroll({ left: 0, top: main.scrollHeight, behavior: 'smooth' });
    }
  }, [footerStatus]);

  return footerStatus;
};

const useParseStepConfiguration = (
  configuration,
  { formConfiguration = {} } = {},
) => {
  const schema = yup
    .object(
      configuration.reduce(
        (acc: Object, val: { field: string; validation: () => void }) => {
          if (!val.field || !val.validation) return acc;

          return {
            ...acc,
            [val.field]: val.validation,
          };
        },
        {},
      ),
    )
    .required();

  const resolver = yupResolver(schema);

  const defaultValues = configuration.reduce(
    (acc: Object, val: { field: string; defaultValue: unknown }) => {
      if (!val.field || !val.defaultValue) return acc;
      return {
        ...acc,
        [val.field]: val.defaultValue,
      };
    },
    {},
  );

  const form = useForm<FormData>({
    resolver,
    defaultValues,
    ...formConfiguration,
  });

  return { form, configuration };
};

const MovieForm = () => {
  const { t } = useTranslation();

  const { form, configuration } = useParseStepConfiguration([
    eventTypeAndThemeStepConfiguration,
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
    },
  ]);

  const { handleSubmit, reset } = form;

  const router = useRouter();

  // eventId is set after adding (saving) the event
  // or when entering the page from the edit route
  const [eventId, setEventId] = useState(
    (router.query.eventId as string) ?? '',
  );

  const toast = useToast({
    messages: {
      image: t('movies.create.toast.success.image'),
      description: t('movies.create.toast.success.description'),
      calendar: t('movies.create.toast.success.calendar'),
      video: t('movies.create.toast.success.video'),
      theme: t('movies.create.toast.success.theme'),
      location: t('movies.create.toast.success.location'),
      name: t('movies.create.toast.success.name'),
    },
    title: t('movies.create.toast.success.title'),
  });

  const publishEvent = usePublishEvent({
    id: eventId,
    onSuccess: () => {
      router.push(`/event/${eventId}/preview`);
    },
  });

  const convertFormDataToEvent = ({
    production,
    eventTypeAndTheme: { eventType, theme },
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
        id: eventType?.id,
        label: eventType?.label,
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

  const addEvent = useAddEvent({
    onSuccess: setEventId,
    convertFormDataToEvent,
    label: 'udb-filminvoer',
  });

  const handleChangeSuccess = (editedField: string) =>
    toast.trigger(editedField);

  const { handleChange, fieldLoading } = useEditField({
    eventId,
    handleSubmit,
    onSuccess: handleChangeSuccess,
  });

  const [isPublishLaterModalVisible, setIsPublishLaterModalVisible] = useState(
    false,
  );

  const convertEventToFormData = (event: Event) => {
    return {
      eventTypeAndTheme: {
        theme: event.terms.find((term) => term.domain === 'theme'),
        eventType: event.terms.find((term) => term.domain === 'eventtype'),
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

  const event = useGetEvent({
    id: eventId,
    onSuccess: (event: Event) => {
      reset(convertEventToFormData(event), {
        keepDirty: true,
      });
    },
  });

  const footerStatus = useFooterStatus({ event, form });

  const title = t(`movies.create.title`);

  return (
    <Page>
      <Page.Title spacing={3} alignItems="center">
        {title}
      </Page.Title>

      <Page.Content spacing={5} alignItems="flex-start">
        <Toast
          variant="success"
          header={toast.header}
          body={toast.message}
          visible={!!toast.message}
          onClose={() => toast.clear()}
        />
        <Steps<FormData>
          configuration={configuration}
          onChange={handleChange}
          fieldLoading={fieldLoading}
          onChangeSuccess={handleChangeSuccess}
          eventId={eventId}
          form={form}
        />
      </Page.Content>
      {footerStatus !== FooterStatus.HIDDEN && (
        <Page.Footer>
          <Inline spacing={3} alignItems="center">
            {footerStatus === FooterStatus.PUBLISH ? (
              [
                <Button
                  variant={ButtonVariants.SUCCESS}
                  onClick={async () => publishEvent()}
                  key="publish"
                >
                  {t('movies.create.actions.publish')}
                </Button>,
                <Button
                  variant={ButtonVariants.SECONDARY}
                  onClick={() => setIsPublishLaterModalVisible(true)}
                  key="publishLater"
                >
                  {t('movies.create.actions.publish_later')}
                </Button>,
                <Text
                  key="info"
                  color={getValue('footer.color')}
                  fontSize="0.9rem"
                >
                  {t('movies.create.footer.auto_save')}
                </Text>,
              ]
            ) : footerStatus === FooterStatus.MANUAL_SAVE ? (
              <Button onClick={handleSubmit(addEvent)}>
                {t('movies.create.actions.save')}
              </Button>
            ) : (
              <Inline spacing={3} alignItems="center">
                <Link
                  href={`/event/${eventId}/preview`}
                  variant={LinkVariants.BUTTON_SUCCESS}
                >
                  <Text>{t('movies.create.footer.done_editing')}</Text>
                </Link>
                <Text color={getValue('footer.color')} fontSize="0.9rem">
                  {t('movies.create.footer.auto_save')}
                </Text>
              </Inline>
            )}
          </Inline>
          <PublishLaterModal
            visible={isPublishLaterModalVisible}
            onConfirm={publishEvent}
            onClose={() => setIsPublishLaterModalVisible(false)}
          />
        </Page.Footer>
      )}
    </Page>
  );
};

export { MovieForm };
export type { FormData };
