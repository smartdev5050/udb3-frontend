import { yupResolver } from '@hookform/resolvers/yup';
import {
  format,
  isMatch,
  nextWednesday,
  parse as parseDate,
  set as setTime,
} from 'date-fns';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import * as yup from 'yup';

import { CalendarType } from '@/constants/CalendarType';
import { EventTypes } from '@/constants/EventTypes';
import type { EventArguments } from '@/hooks/api/events';
import {
  useAddEventMutation,
  useAddLabelMutation,
  useChangeCalendarMutation,
  useChangeLocationMutation,
  useChangeNameMutation,
  useChangeThemeMutation,
  useChangeTypicalAgeRangeMutation,
  useGetEventByIdQuery,
  usePublishMutation,
} from '@/hooks/api/events';
import {
  useAddEventByIdMutation as useAddEventToProductionByIdMutation,
  useCreateWithEventsMutation as useCreateProductionWithEventsMutation,
  useDeleteEventByIdMutation as useDeleteEventFromProductionByIdMutation,
} from '@/hooks/api/productions';
import type { StepsConfiguration } from '@/pages/Steps';
import { Steps } from '@/pages/Steps';
import {
  AdditionalInformationStep,
  AdditionalInformationStepVariant,
} from '@/pages/steps/AdditionalInformationStep';
import { EventTypeAndThemeStep } from '@/pages/steps/EventTypeAndThemeStep';
import { PublishLaterModal } from '@/pages/steps/modals/PublishLaterModal';
import { PlaceStep } from '@/pages/steps/PlaceStep';
import { ProductionStep } from '@/pages/steps/ProductionStep';
import { TimeTableStep } from '@/pages/steps/TimeTableStep';
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
import type { TimeTableValue } from '@/ui/TimeTable';
import {
  areAllTimeSlotsValid,
  isOneTimeSlotValid,
  isTimeTableEmpty,
} from '@/ui/TimeTable';
import { Toast } from '@/ui/Toast';
import { formatDateToISO } from '@/utils/formatDateToISO';
import { parseOfferId } from '@/utils/parseOfferId';

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

const schema = yup
  .object({
    eventTypeAndTheme: yup.object().shape({}).required(),
    timeTable: yup
      .mixed()
      .test({
        name: 'all-timeslots-valid',
        test: (timeTableData) => areAllTimeSlotsValid(timeTableData),
      })
      .test({
        name: 'has-timeslot',
        test: (timeTableData) => !isTimeTableEmpty(timeTableData),
      })
      .required(),
    place: yup.object().shape({}).required(),
    production: yup.object().shape({}).required(),
  })
  .required();

type EncodedTimeTable = Array<{ start: string; end: string }>;

const convertTimeTableToSubEvents = (timeTable: TimeTableValue) => {
  const { data = {} } = timeTable;
  return Object.keys(data).reduce<EncodedTimeTable>(
    (acc, date) => [
      ...acc,
      ...Object.keys(data[date]).reduce<EncodedTimeTable>((acc, index) => {
        const time = data[date][index];

        if (!time || !isMatch(time, "HH'h'mm'm'")) {
          return acc;
        }

        const isoDate = formatDateToISO(
          setTime(parseDate(date, 'dd/MM/yyyy', new Date()), {
            hours: parseInt(time.substring(0, 2)),
            minutes: parseInt(time.substring(3, 5)),
            seconds: 0,
          }),
        );

        return [
          ...acc,
          {
            start: isoDate,
            end: isoDate,
          },
        ];
      }, []),
    ],
    [],
  );
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

const nextWeekWednesday = nextWednesday(new Date());
const formatDate = (date: Date) => format(date, 'dd/MM/yyyy');

const usePublishEvent = ({ id, onSuccess }) => {
  const queryClient = useQueryClient();

  const publishMutation = usePublishMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(['events', { id }]);
      onSuccess();
    },
  });

  return async (date: Date = new Date()) => {
    if (!id) return;

    await publishMutation.mutateAsync({
      eventId: id,
      publicationDate: formatDateToISO(date),
    });
  };
};

const useAddEvent = ({ onSuccess }) => {
  const addEventMutation = useAddEventMutation();
  const changeTypicalAgeRangeMutation = useChangeTypicalAgeRangeMutation();
  const addLabelMutation = useAddLabelMutation();
  
  const createProductionWithEventsMutation = useCreateProductionWithEventsMutation();
  const addEventToProductionByIdMutation = useAddEventToProductionByIdMutation();

  return async ({
    production,
    place,
    eventTypeAndTheme: { eventType, theme },
    timeTable,
  }: FormData) => {
    if (!production) return;

    const payload: EventArguments = {
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

    const { eventId } = await addEventMutation.mutateAsync(payload);

    if (!eventId) return;

    await changeTypicalAgeRangeMutation.mutateAsync({
      eventId,
      typicalAgeRange: '-',
    });

    await addLabelMutation.mutateAsync({
      eventId,
      label: 'udb-filminvoer',
    });

    if (production.customOption) {
      await createProductionWithEventsMutation.mutateAsync({
        productionName: production.name,
        eventIds: [eventId],
      });
    } else {
      await addEventToProductionByIdMutation.mutateAsync({
        productionId: production.production_id,
        eventId,
      });
    }

    onSuccess(eventId);
  };
};

const useEditField = ({ onSuccess, id, handleSubmit }) => {
  const queryClient = useQueryClient();
  const [fieldLoading, setFieldLoading] = useState<keyof FormData>();

  const getEventByIdQuery = useGetEventByIdQuery({ id });

  const createProductionWithEventsMutation = useCreateProductionWithEventsMutation();
  const deleteEventFromProductionByIdMutation = useDeleteEventFromProductionByIdMutation();

  const handleSuccess = (editedField: string) => {
    onSuccess(editedField);
    if (editedField !== 'timeTable') {
      queryClient.invalidateQueries(['events', { id }]);
    }
  };

  const changeThemeMutation = useChangeThemeMutation({
    onSuccess: () => handleSuccess('theme'),
  });

  const changeLocationMutation = useChangeLocationMutation({
    onSuccess: () => handleSuccess('cinema'),
  });

  const changeCalendarMutation = useChangeCalendarMutation({
    onSuccess: () => handleSuccess('calendar'),
  });

  const changeNameMutation = useChangeNameMutation({
    onSuccess: () => handleSuccess('name'),
  });

  const editEvent = async (
    { production, place, eventTypeAndTheme, timeTable }: FormData,
    editedField?: keyof FormData,
  ) => {
    if (!editedField) return;

    type FieldToMutationMap = Partial<
      Record<keyof FormData, () => Promise<void>>
    >;

    const fieldToMutationFunctionMap: FieldToMutationMap = {
      eventTypeAndTheme: async () => {
        await changeThemeMutation.mutateAsync({
          id,
          themeId: eventTypeAndTheme.theme.id,
        });
      },
      timeTable: async () => {
        await changeCalendarMutation.mutateAsync({
          id,
          calendarType: CalendarType.MULTIPLE,
          timeSpans: convertTimeTableToSubEvents(timeTable),
        });
      },
      place: async () => {
        if (!place) return;

        await changeLocationMutation.mutateAsync({
          id,
          locationId: parseOfferId(place['@id']),
        });
      },
      production: async () => {
        if (!production) return;

        // unlink event from current production
        // @ts-expect-error
        if (getEventByIdQuery.data?.production?.id) {
          await deleteEventFromProductionByIdMutation.mutateAsync({
            // @ts-expect-error
            productionId: getEventByIdQuery.data.production.id,
            eventId: id,
          });
        }

        if (production.customOption) {
          // make new production with name and event id
          await createProductionWithEventsMutation.mutateAsync({
            productionName: production.name,
            eventIds: [id],
          });
        } else {
          // link event to production
          await addEventToProductionByIdMutation.mutateAsync({
            productionId: production.production_id,
            eventId: id,
          });
        }

        // change name of event
        await changeNameMutation.mutateAsync({
          id,
          lang: 'nl',
          name: production.name,
        });
      },
    };

    await fieldToMutationFunctionMap[editedField]?.();

    setFieldLoading(undefined);
  };

  const handleChange = (editedField: keyof FormData) => {
    if (!id) return;
    setFieldLoading(editedField);
    handleSubmit(async (formData: FormData) =>
      editEvent(formData, editedField),
    )();
  };

  return { handleChange, fieldLoading };
};

const useToast = ({ messages, title }) => {
  const [message, setMessage] = useState<string>();

  const clear = () => setMessage(undefined);

  const trigger = (key: string) => {
    const foundMessage = messages[key];
    if (!foundMessage) return;
    setMessage(foundMessage);
  };

  const header = useMemo(
    () => (
      <Inline as="div" flex={1} justifyContent="space-between">
        <Text>{title}</Text>
        <Text>{format(new Date(), 'HH:mm')}</Text>
      </Inline>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [message],
  );

  return { message, header, clear, trigger };
};

const MovieForm = () => {
  const form = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      timeTable: {
        data: {},
        dateStart: formatDate(nextWeekWednesday),
        dateEnd: formatDate(nextWeekWednesday),
      },
      eventTypeAndTheme: {
        eventType: {
          id: EventTypes.Film,
          label: 'Film',
        },
      },
    },
  });

  const {
    handleSubmit,
    formState: { errors, dirtyFields },
    reset,
    watch,
    trigger,
  } = form;

  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [newEventId, setNewEventId] = useState(
    (router.query.eventId as string) ?? '',
  );

  const getEventByIdQuery = useGetEventByIdQuery({ id: newEventId });

  const toast = useToast({
    messages: {
      image: t('movies.create.toast.success.image'),
      description: t('movies.create.toast.success.description'),
      calendar: t('movies.create.toast.success.calendar'),
      video: t('movies.create.toast.success.video'),
      theme: t('movies.create.toast.success.theme'),
      cinema: t('movies.create.toast.success.cinema'),
      timeslot: t('movies.create.toast.success.timeslot'),
      name: t('movies.create.toast.success.name'),
    },
    title: t('movies.create.toast.success.title'),
  });

  const publishEvent = usePublishEvent({
    id: newEventId,
    onSuccess: () => {
      router.push(`/event/${newEventId}/preview`);
    },
  });

  const addEvent = useAddEvent({
    onSuccess: setNewEventId,
  });

  const { handleChange, fieldLoading } = useEditField({
    id: newEventId,
    handleSubmit,
    onSuccess: toast.trigger,
  });

  const [isPublishLaterModalVisible, setIsPublishLaterModalVisible] = useState(
    false,
  );

  useEffect(() => {
    // @ts-expect-error
    const event: Event = getEventByIdQuery.data;
    if (!event) return;

    reset(
      {
        eventTypeAndTheme: {
          theme: event.terms.find((term) => term.domain === 'theme'),
          eventType: event.terms.find((term) => term.domain === 'eventtype'),
        },
        place: event.location,
        timeTable: convertSubEventsToTimeTable(event.subEvent),
        production: {
          production_id: event.production.id,
          name: event.production.title,
          events: event.production.otherEvents,
        },
      },
      { keepDirty: true },
    );

    trigger('timeTable');

    // @ts-expect-error
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEventByIdQuery.data]);

  const footerStatus = useMemo(() => {
    if (queryClient.isMutating()) return FooterStatus.HIDDEN;
    // @ts-expect-error
    if (newEventId && !getEventByIdQuery.data?.availableFrom) {
      return FooterStatus.PUBLISH;
    }
    if (router.route.includes('edit')) return FooterStatus.AUTO_SAVE;
    if (dirtyFields.place) return FooterStatus.MANUAL_SAVE;
    return FooterStatus.HIDDEN;
  }, [
    newEventId,
    // @ts-expect-error
    getEventByIdQuery.data?.availableFrom,
    dirtyFields.place,
    queryClient,
    router.route,
  ]);

  useEffect(() => {
    if (footerStatus !== FooterStatus.HIDDEN) {
      const main = document.querySelector('main');
      main.scroll({ left: 0, top: main.scrollHeight, behavior: 'smooth' });
    }
  }, [footerStatus]);

  const watchedTimeTable = watch('timeTable');
  const watchedPlace = watch('place');

  const configuration: StepsConfiguration<FormData> = useMemo(() => {
    return [
      {
        Component: EventTypeAndThemeStep,
        field: 'eventTypeAndTheme',
        title: t(`movies.create.step1.title`),
      },
      {
        Component: TimeTableStep,
        field: 'timeTable',
        shouldShowNextStep: isOneTimeSlotValid(watchedTimeTable),
        title: t(`movies.create.step2.title`),
      },
      {
        Component: PlaceStep,
        field: 'place',
        shouldShowNextStep: watchedPlace !== undefined,
        title: t(`movies.create.step3.title`),
        additionalProps: {
          terms: [EventTypes.Bioscoop],
        },
      },
      {
        Component: ProductionStep,
        field: 'production',
        shouldShowNextStep: !!newEventId && Object.values(errors).length === 0,
        title: t(`movies.create.step4.title`),
      },
      {
        Component: AdditionalInformationStep,
        additionalProps: {
          variant: AdditionalInformationStepVariant.MINIMAL,
          eventId: newEventId,
          onSuccess: toast.trigger,
        },
        title: t(`movies.create.step5.title`),
      },
    ];
  }, [errors, newEventId, watchedPlace, watchedTimeTable, t, toast.trigger]);

  return (
    <Page>
      <Page.Title spacing={3} alignItems="center">
        {t(`movies.create.title`)}
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
          mode={!!newEventId || !!router.query.eventId ? 'UPDATE' : 'CREATE'}
          onChange={handleChange}
          fieldLoading={fieldLoading}
          {...form}
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
                  href={`/event/${newEventId}/preview`}
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
