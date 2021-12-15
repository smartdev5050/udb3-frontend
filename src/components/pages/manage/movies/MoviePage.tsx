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
import type { Event } from '@/types/Event';
import type { SubEvent } from '@/types/Offer';
import type { Place } from '@/types/Place';
import type { Production } from '@/types/Production';
import { WorkflowStatusMap } from '@/types/WorkflowStatus';
import { Button, ButtonVariants } from '@/ui/Button';
import { Inline } from '@/ui/Inline';
import { Page } from '@/ui/Page';
import type { TimeTableValue } from '@/ui/TimeTable';
import { areAllTimeSlotsValid, isOneTimeSlotValid } from '@/ui/TimeTable';
import { formatDateToISO } from '@/utils/formatDateToISO';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';
import { parseOfferId } from '@/utils/parseOfferId';

import { PublishLaterModal } from './PublishLaterModal';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Step4 } from './Step4';
import { Step5 } from './Step5';

type FormData = {
  theme: string;
  timeTable: any;
  cinema: Place;
  production: Production & { customOption?: boolean };
};

type StepProps = Pick<
  UseFormReturn<FormData>,
  'control' | 'getValues' | 'register' | 'reset'
> & {
  errors: Partial<Record<keyof FormData, any>>;
  loading: boolean;
  onChange: (value: any) => void;
};

const FooterStatus = {
  PUBLISH: 'PUBLISH',
  SAVE: 'SAVE',
} as const;

const schema = yup
  .object({
    theme: yup.string(),
    timeTable: yup
      .mixed()
      .test({
        name: 'has-timeslot',
        test: (timeTableData) => areAllTimeSlotsValid(timeTableData),
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
  const {
    handleSubmit,
    formState: { errors, dirtyFields },
    register,
    control,
    getValues,
    reset,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [newEventId, setNewEventId] = useState(
    (router.query.eventId as string) ?? '',
  );
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

  const changeThemeMutation = useChangeTheme();

  const changeLocationMutation = useChangeLocation();

  const changeCalendarMutation = useChangeCalendar();

  const changeNameMutation = useChangeName();

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

  const handleChange = (editedField: keyof FormData, value) => {
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
    // @ts-expect-error
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEventByIdQuery.data]);

  const stepProps = (field?: keyof FormData) => ({
    errors,
    control,
    onChange: (value) => handleChange(field, value),
    getValues,
    register,
    reset,
    loading: !!(field && fieldLoading === field),
  });

  const watchedTimeTable = watch('timeTable');

  const isStep3Visible =
    !!newEventId ||
    (dirtyFields.timeTable && isOneTimeSlotValid(watchedTimeTable));
  const isStep4Visible = !!newEventId || (dirtyFields.cinema && isStep3Visible);
  const isStep5Visible = !!newEventId && Object.values(errors).length === 0;

  const footerStatus = useMemo(() => {
    if (queryClient.isMutating()) return undefined;
    if (newEventId && !availableFromDate) return FooterStatus.PUBLISH;
    if (dirtyFields.cinema) return FooterStatus.SAVE;
    return undefined;
  }, [newEventId, availableFromDate, dirtyFields.cinema, queryClient]);

  useEffect(() => {
    if (footerStatus) {
      const main = document.querySelector('main');
      main.scroll({ left: 0, top: main.scrollHeight, behavior: 'smooth' });
    }
  }, [footerStatus]);

  return (
    <Page>
      <Page.Title spacing={3} alignItems="center">
        {t(`movies.create.title`)}
      </Page.Title>

      <Page.Content spacing={5} paddingBottom={6} alignItems="flex-start">
        <Step1 {...stepProps('theme')} />
        <Step2 {...stepProps('timeTable')} />
        {isStep3Visible ? <Step3 {...stepProps('cinema')} /> : null}
        {isStep4Visible ? <Step4 {...stepProps('production')} /> : null}
        {isStep5Visible ? (
          <Step5 {...{ ...stepProps(), eventId: newEventId }} />
        ) : null}
      </Page.Content>
      {footerStatus ? (
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
            ) : (
              <Button
                onClick={handleSubmit(async (formData) => {
                  handleFormValid(formData);
                })}
              >
                {t('movies.create.actions.save')}
              </Button>
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
      ) : null}
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export { MoviePage };
export type { StepProps };
