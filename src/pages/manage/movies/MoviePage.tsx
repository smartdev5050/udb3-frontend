import { yupResolver } from '@hookform/resolvers/yup';
import { format, isMatch, parse as parseDate, set as setTime } from 'date-fns';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import * as yup from 'yup';

import { CalendarType } from '@/constants/CalendarType';
import { MovieThemes } from '@/constants/MovieThemes';
import { OfferCategories } from '@/constants/OfferCategories';
import type { EventArguments } from '@/hooks/api/events';
import {
  useAddEvent,
  useAddLabel,
  useChangeCalendar,
  useChangeLocation,
  useChangeName,
  useChangeTheme,
  useChangeTypicalAgeRange,
  useGetEventById,
  usePublish,
} from '@/hooks/api/events';
import {
  useAddEventById as useAddEventToProductionById,
  useCreateWithEvents as useCreateProductionWithEvents,
  useDeleteEventById as useDeleteEventFromProductionById,
} from '@/hooks/api/productions';
import type { StepsConfiguration } from '@/pages/Steps';
import { Steps } from '@/pages/Steps';
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
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';
import { parseOfferId } from '@/utils/parseOfferId';

import { MovieAdditionalInformationStep } from './MovieAdditionalInformationStep';
import { MovieCinemaStep } from './MovieCinemaStep';
import { MovieNameStep } from './MovieNameStep';
import { MovieThemeStep } from './MovieThemeStep';
import { MovieTimeTableStep } from './MovieTimeTableStep';
import { PublishLaterModal } from './PublishLaterModal';

type FormData = {
  theme: string;
  timeTable: any;
  cinema: Place;
  production: Production & { customOption?: boolean };
};

type StepProps = Pick<
  UseFormReturn<FormData>,
  'control' | 'getValues' | 'register' | 'reset' | 'formState'
> & {
  loading: boolean;
  onChange: (value: any) => void;
};

const getValue = getValueFromTheme('moviesCreatePage');

const FooterStatus = {
  HIDDEN: 'HIDDEN',
  PUBLISH: 'PUBLISH',
  MANUAL_SAVE: 'MANUAL_SAVE',
  AUTO_SAVE: 'AUTO_SAVE',
} as const;

const schema = yup
  .object({
    theme: yup.string(),
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
    cinema: yup.object().shape({}).required(),
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

const MoviePage = () => {
  const form = useForm<FormData>({
    resolver: yupResolver(schema),
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

  const [toastMessage, setToastMessage] = useState<string>();

  const [isPublishLaterModalVisible, setIsPublishLaterModalVisible] = useState(
    false,
  );
  const [publishLaterDate, setPublishLaterDate] = useState(new Date());
  const [fieldLoading, setFieldLoading] = useState<keyof FormData>();

  const addEventMutation = useAddEvent({
    onSuccess: async () => await queryClient.invalidateQueries('events'),
  });

  const getEventByIdQuery = useGetEventById({ id: newEventId });

  const addEventToProductionByIdMutation = useAddEventToProductionById();

  const changeTypicalAgeRangeMutation = useChangeTypicalAgeRange();

  const addLabelMutation = useAddLabel();

  const createProductionWithEventsMutation = useCreateProductionWithEvents();

  const deleteEventFromProductionByIdMutation = useDeleteEventFromProductionById();

  const publishMutation = usePublish({
    onSuccess: async () => {
      await queryClient.invalidateQueries(['events', { id: newEventId }]);
      router.push(`/event/${newEventId}/preview`);
    },
  });

  const changeThemeMutation = useChangeTheme({
    onSuccess: () => setToastMessage(t('movies.create.toast.success.theme')),
  });

  const changeLocationMutation = useChangeLocation({
    onSuccess: () => setToastMessage(t('movies.create.toast.success.cinema')),
  });

  const changeCalendarMutation = useChangeCalendar({
    onSuccess: () => setToastMessage(t('movies.create.toast.success.timeslot')),
  });

  const changeNameMutation = useChangeName({
    onSuccess: () => setToastMessage(t('movies.create.toast.success.name')),
  });

  const availableFromDate = useMemo(() => {
    // @ts-expect-error
    if (!getEventByIdQuery.data?.availableFrom) return;
    // @ts-expect-error
    return new Date(getEventByIdQuery.data?.availableFrom);
    // @ts-expect-error
  }, [getEventByIdQuery.data]);

  const editExistingEvent = async (
    { production, cinema, theme: themeId, timeTable }: FormData,
    editedField?: keyof FormData,
  ) => {
    if (!editedField) return;

    type FieldToMutationMap = Partial<
      Record<keyof FormData, () => Promise<void>>
    >;

    const fieldToMutationFunctionMap: FieldToMutationMap = {
      theme: async () => {
        await changeThemeMutation.mutateAsync({
          id: newEventId,
          themeId,
        });
      },
      timeTable: async () => {
        await changeCalendarMutation.mutateAsync({
          id: newEventId,
          calendarType: CalendarType.MULTIPLE,
          timeSpans: convertTimeTableToSubEvents(timeTable),
        });
      },
      cinema: async () => {
        if (!cinema) return;

        await changeLocationMutation.mutateAsync({
          id: newEventId,
          locationId: parseOfferId(cinema['@id']),
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
            eventId: newEventId,
          });
        }

        if (production.customOption) {
          // make new production with name and event id
          await createProductionWithEventsMutation.mutateAsync({
            productionName: production.name,
            eventIds: [newEventId],
          });
        } else {
          // link event to production
          await addEventToProductionByIdMutation.mutateAsync({
            productionId: production.production_id,
            eventId: newEventId,
          });
        }

        // change name of event
        await changeNameMutation.mutateAsync({
          id: newEventId,
          lang: 'nl',
          name: production.name,
        });
      },
    };

    await fieldToMutationFunctionMap[editedField]?.();

    setFieldLoading(undefined);

    if (editedField !== 'timeTable') {
      queryClient.invalidateQueries(['events', { id: newEventId }]);
    }
  };

  const createNewEvent = async ({
    production,
    cinema,
    theme: themeId,
    timeTable,
  }: FormData) => {
    if (!production) return;

    const themeLabel = Object.entries(MovieThemes).find(
      ([key, value]) => value === themeId,
    )?.[0];

    const payload: EventArguments = {
      mainLanguage: 'nl',
      name: production.name,
      calendar: {
        calendarType: CalendarType.MULTIPLE,
        timeSpans: convertTimeTableToSubEvents(timeTable),
      },
      type: {
        id: OfferCategories.Film,
        label: 'Film',
        domain: 'eventtype',
      },
      ...(themeLabel && {
        theme: {
          id: themeId,
          label: themeLabel,
          domain: 'theme',
        },
      }),
      location: {
        id: parseOfferId(cinema['@id']),
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

    setNewEventId(eventId);
  };

  const handleFormValid = async (
    formData: FormData,
    editedField?: keyof FormData,
  ) => {
    if (newEventId) {
      await editExistingEvent(formData, editedField);
    } else {
      await createNewEvent(formData);
    }
  };

  const handleClickPublish = async () => {
    await publishMutation.mutateAsync({
      eventId: newEventId,
      publicationDate: formatDateToISO(new Date()),
    });
  };

  const handleClickPublishLater = () => setIsPublishLaterModalVisible(true);

  const handleConfirmPublishLater = async () => {
    await publishMutation.mutateAsync({
      eventId: newEventId,
      publicationDate: formatDateToISO(publishLaterDate),
    });
  };

  const handleChange = (editedField: keyof FormData) => {
    if (!newEventId) return;
    submitEditedField(editedField);
  };

  const submitEditedField = (editedField: keyof FormData) => {
    setFieldLoading(editedField);
    handleSubmit(async (formData) => handleFormValid(formData, editedField))();
  };

  useEffect(() => {
    // @ts-expect-error
    const event: Event = getEventByIdQuery.data;
    if (!event) return;

    reset(
      {
        theme: event.terms.find((term) => term.domain === 'theme')?.id,
        cinema: event.location,
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
    if (newEventId && !availableFromDate) return FooterStatus.PUBLISH;
    if (dirtyFields.cinema) return FooterStatus.MANUAL_SAVE;
    if (newEventId) return FooterStatus.AUTO_SAVE;
    return FooterStatus.HIDDEN;
  }, [newEventId, availableFromDate, dirtyFields.cinema, queryClient]);

  useEffect(() => {
    if (footerStatus !== FooterStatus.HIDDEN) {
      const main = document.querySelector('main');
      main.scroll({ left: 0, top: main.scrollHeight, behavior: 'smooth' });
    }
  }, [footerStatus]);

  const header = useMemo(
    () => (
      <Inline as="div" flex={1} justifyContent="space-between">
        <Text>{t('movies.create.toast.success.title')}</Text>
        <Text>{format(new Date(), 'HH:mm')}</Text>
      </Inline>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toastMessage],
  );
  const watchedTimeTable = watch('timeTable');
  const watchedCinema = watch('cinema');

  const configuration: StepsConfiguration = useMemo(() => {
    return [
      {
        Component: MovieThemeStep,
        inputKey: 'theme',
        title: t(`movies.create.step1.title`),
      },
      {
        Component: MovieTimeTableStep,
        inputKey: 'timeTable',
        shouldShowNextStep: isOneTimeSlotValid(watchedTimeTable),
        title: t(`movies.create.step2.title`),
      },
      {
        Component: MovieCinemaStep,
        inputKey: 'cinema',
        shouldShowNextStep: watchedCinema !== undefined,
        title: t(`movies.create.step3.title`),
      },
      {
        Component: MovieNameStep,
        inputKey: 'production',
        shouldShowNextStep: !!newEventId && Object.values(errors).length === 0,
        title: t(`movies.create.step4.title`),
      },
      {
        Component: MovieAdditionalInformationStep,
        additionalProps: {
          eventId: newEventId,
          onSuccess: (field: string) => {
            if (field === 'image') {
              setToastMessage(t('movies.create.toast.success.image'));
            }
            if (field === 'description') {
              setToastMessage(t('movies.create.toast.success.description'));
            }
          },
        },
        title: t(`movies.create.step5.title`),
      },
    ];
  }, [errors, newEventId, watchedCinema, watchedTimeTable, t]);

  return (
    <Page>
      <Page.Title spacing={3} alignItems="center">
        {t(`movies.create.title`)}
      </Page.Title>

      <Page.Content spacing={5} paddingBottom={6} alignItems="flex-start">
        <Toast
          variant="success"
          header={header}
          body={toastMessage}
          visible={!!toastMessage}
          onClose={() => setToastMessage(undefined)}
        />
        <Steps
          configuration={configuration}
          mode={!!newEventId || !!router.query.eventId ? 'UPDATE' : 'CREATE'}
          onChange={handleChange}
          fieldLoading={fieldLoading}
          {...form}
        />
      </Page.Content>
      {footerStatus !== FooterStatus.HIDDEN && (
        <Page.Footer>
          <Inline spacing={3}>
            {footerStatus === FooterStatus.PUBLISH ? (
              [
                <Button
                  variant={ButtonVariants.SUCCESS}
                  onClick={handleClickPublish}
                  key="publish"
                >
                  {t('movies.create.actions.publish')}
                </Button>,
                <Button
                  variant={ButtonVariants.SECONDARY}
                  onClick={handleClickPublishLater}
                  key="publishLater"
                >
                  {t('movies.create.actions.publish_later')}
                </Button>,
              ]
            ) : footerStatus === FooterStatus.MANUAL_SAVE ? (
              <Button
                onClick={handleSubmit(async (formData) => {
                  handleFormValid(formData);
                })}
              >
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
            selectedDate={publishLaterDate}
            onChangeDate={setPublishLaterDate}
            onConfirm={handleConfirmPublishLater}
            onClose={() => setIsPublishLaterModalVisible(false)}
          />
        </Page.Footer>
      )}
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export { MoviePage };
export type { StepProps };
