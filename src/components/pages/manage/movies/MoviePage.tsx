import { yupResolver } from '@hookform/resolvers/yup';
import {
  format,
  getHours,
  getMinutes,
  isMatch,
  parse as parseDate,
  set as setTime,
} from 'date-fns';
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
import { QueryStatus } from '@/hooks/api/authenticated-query';
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
import { useAddEventById, useCreateWithEvents } from '@/hooks/api/productions';
import type { Event } from '@/types/Event';
import type { SubEvent } from '@/types/Offer';
import type { Place } from '@/types/Place';
import type { Production } from '@/types/Production';
import { WorkflowStatusMap } from '@/types/WorkflowStatus';
import { Button, ButtonVariants } from '@/ui/Button';
import { Inline } from '@/ui/Inline';
import { Page } from '@/ui/Page';
import { Spinner } from '@/ui/Spinner';
import type { TimeTableValue } from '@/ui/TimeTable';
import { formatTimeValue } from '@/ui/TimeTable';
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
};

const FooterStatus = {
  PUBLISH: 'PUBLISH',
  SAVE: 'SAVE',
} as const;

const schema = yup
  .object({
    theme: yup.string(),
    timeTable: yup.mixed().required(),
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

  const data = subEvents.reduce((acc, subEvent, index) => {
    const date = new Date(subEvent.startDate);
    const dateWithoutTime = format(date, 'dd/MM/yyyy');

    const time = formatTimeValue(`${getHours(date)}${getMinutes(date)}`);

    acc[dateWithoutTime] = [...(acc[dateWithoutTime] ?? []), time].filter(
      (v) => !!v,
    );

    return acc;
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
    watch,
    getValues,
    reset,
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

  const addEventByIdMutation = useAddEventById();

  const changeTypicalAgeRangeMutation = useChangeTypicalAgeRange();

  const addLabelMutation = useAddLabel();

  const createWithEventsMutation = useCreateWithEvents();

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

  const watchedTheme = watch('theme');
  const watchedTimeTable = watch('timeTable');
  const watchedCinema = watch('cinema');
  const watchedProduction = watch('production');

  const availableFromDate = useMemo(() => {
    // @ts-expect-error
    if (!getEventByIdQuery.data?.availableFrom) return;
    // @ts-expect-error
    return new Date(getEventByIdQuery.data?.availableFrom);
    // @ts-expect-error
  }, [getEventByIdQuery.data]);

  const handleFormValid = async (
    { production, cinema, theme: themeId, timeTable }: FormData,
    editedField?: keyof FormData,
  ) => {
    if (newEventId) {
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

          await changeNameMutation.mutateAsync({
            id: newEventId,
            lang: 'nl',
            name: production.name,
          });
        },
      };

      await fieldToMutationFunctionMap[editedField]?.();

      setFieldLoading(undefined);
      return;
    }

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
      await createWithEventsMutation.mutateAsync({
        productionName: production.name,
        eventIds: [eventId],
      });
    } else {
      await addEventByIdMutation.mutateAsync({
        productionId: production.production_id,
        eventId,
      });
    }

    setNewEventId(eventId);
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

  const submitEditedField = (editedField: keyof FormData) => {
    setFieldLoading(editedField);
    handleSubmit(async (formData) => handleFormValid(formData, editedField))();
  };

  useEffect(() => {
    if (!newEventId) return;
    submitEditedField('theme');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedTheme]);

  useEffect(() => {
    if (!newEventId) return;
    submitEditedField('timeTable');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedTimeTable]);

  useEffect(() => {
    if (!newEventId) return;
    submitEditedField('cinema');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedCinema]);

  useEffect(() => {
    if (!newEventId) return;
    submitEditedField('production');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedProduction]);

  useEffect(() => {
    // @ts-expect-error
    const event: Event = getEventByIdQuery.data;
    if (!event) return;

    reset({
      theme: event.terms.find((term) => term.domain === 'theme')?.id,
      cinema: event.location,
      timeTable: convertSubEventsToTimeTable(event.subEvent),
      production: {
        production_id: event.production.id,
        name: event.production.title,
        events: event.production.otherEvents,
      },
    });
    // @ts-expect-error
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEventByIdQuery.data]);

  const stepProps = (field?: keyof FormData) => ({
    errors,
    control,
    getValues,
    register,
    reset,
    loading: !!(field && fieldLoading === field),
  });

  const isStep3Visible =
    dirtyFields.timeTable && Object.keys(watchedTimeTable.data).length > 0;
  const isStep4Visible = dirtyFields.cinema;
  const isStep5Visible = !!newEventId && Object.values(errors).length === 0;

  const footerStatus = useMemo(() => {
    if (newEventId && !availableFromDate) return FooterStatus.PUBLISH;
    if (dirtyFields.cinema) return FooterStatus.SAVE;
    return undefined;
  }, [newEventId, availableFromDate, dirtyFields.cinema]);

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
      {newEventId &&
      // @ts-expect-error
      getEventByIdQuery.status === QueryStatus.LOADING ? (
        <Page.Content spacing={5} paddingBottom={6} alignItems="flex-start">
          <Spinner marginTop={4} />
        </Page.Content>
      ) : (
        <Page.Content spacing={5} paddingBottom={6} alignItems="flex-start">
          <Step1 {...stepProps('theme')} />
          <Step2 {...stepProps('timeTable')} />
          {isStep3Visible ? <Step3 {...stepProps('cinema')} /> : null}
          {isStep4Visible ? <Step4 {...stepProps('production')} /> : null}
          {isStep5Visible ? (
            <Step5 {...{ ...stepProps(), eventId: newEventId }} />
          ) : null}
        </Page.Content>
      )}
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
