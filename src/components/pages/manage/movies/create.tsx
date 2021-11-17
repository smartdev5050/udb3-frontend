import { yupResolver } from '@hookform/resolvers/yup';
import { addDays, isMatch, set as setTime } from 'date-fns';
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
  useChangeTheme,
  useChangeTypicalAgeRange,
  useGetEventById,
  usePublish,
} from '@/hooks/api/events';
import { useAddEventById, useCreateWithEvents } from '@/hooks/api/productions';
import type { Place } from '@/types/Place';
import type { Production } from '@/types/Production';
import { WorkflowStatusMap } from '@/types/WorkflowStatus';
import { Button, ButtonVariants } from '@/ui/Button';
import { Inline } from '@/ui/Inline';
import { Page } from '@/ui/Page';
import { formatDateToISO } from '@/utils/formatDateToISO';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';
import { parseOfferId } from '@/utils/parseOfferId';

import { PublishLaterModal } from './PublishLaterModal';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Step4 } from './Step4';
import { Step5 } from './Step5';

type Time = string;

const createTimeTablePayload = (timeTable: Time[][], dateStart: string) =>
  timeTable.reduce((acc, row, rowIndex) => {
    const onlyTimeStrings = row.reduce((acc, time) => {
      if (!time || isMatch(time, "HH'h'mm'm'")) {
        return acc;
      }

      const hours = parseInt(time.substring(0, 2));
      const minutes = parseInt(time.substring(3, 5));
      const rowDate = addDays(new Date(dateStart), rowIndex);
      const dateWithTime = setTime(rowDate, {
        hours,
        minutes,
        seconds: 0,
      });

      const isoDateTime = formatDateToISO(dateWithTime);

      return [
        ...acc,
        {
          start: isoDateTime,
          end: isoDateTime,
        },
      ];
    }, []);
    return [...acc, ...onlyTimeStrings];
  }, []);

const schema = yup
  .object({
    theme: yup.string(),
    timeTable: yup
      .array()
      .test('has-timeslot', (value) =>
        value.some((rows) => rows.some((cell) => !!cell)),
      )
      .required(),
    dateStart: yup.string().required(),
    cinema: yup
      .array()
      .test('selected-cinema', (value) => !!value?.length)
      .required(),
    production: yup
      .array()
      .test('selected-production', (value) => !!value?.length)
      .required(),
  })
  .required();

type FormData = {
  theme: string;
  timeTable: Time[][];
  cinema: Place[];
  production: Array<Production & { customOption?: boolean }>;
  dateStart: string;
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

const Create = () => {
  const {
    handleSubmit,
    formState: { errors, dirtyFields },
    register,
    control,
    watch,
    getValues,
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      dateStart: new Date().toISOString(),
      timeTable: [],
    },
  });

  const { t, i18n } = useTranslation();
  const router = useRouter();

  const queryClient = useQueryClient();

  const [newEventId, setNewEventId] = useState('');
  const [isPublishLaterModalVisible, setIsPublishLaterModalVisible] = useState(
    false,
  );
  const [publishLaterDate, setPublishLaterDate] = useState(new Date());

  const [fieldLoading, setFieldLoading] = useState<keyof FormData>();

  const addEventMutation = useAddEvent({
    onSuccess: async () => await queryClient.invalidateQueries('events'),
  });

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

  const getEventByIdQuery = useGetEventById({ id: newEventId });

  const changeThemeMutation = useChangeTheme();

  const availableFromDate = useMemo(() => {
    // @ts-expect-error
    if (!getEventByIdQuery.data?.availableFrom) return;
    // @ts-expect-error
    return new Date(getEventByIdQuery.data?.availableFrom);
    // @ts-expect-error
  }, [getEventByIdQuery.data]);

  const handleFormValid = async (
    {
      production: productions,
      cinema: cinemas,
      theme: themeId,
      timeTable,
      dateStart,
    }: FormData,
    editedField?: keyof FormData,
  ) => {
    if (newEventId && editedField) {
      if (editedField === 'theme') {
        await changeThemeMutation.mutateAsync({
          id: newEventId,
          themeId,
        });
      }

      setFieldLoading(undefined);
      return;
    }

    if (!productions.length) return;

    const themeLabel = Object.entries(MovieThemes).find(
      ([key, value]) => value === themeId,
    )?.[0];

    const payload: EventArguments = {
      mainLanguage: i18n.language as 'nl' | 'fr',
      name: productions[0].name,
      calendar: {
        calendarType: CalendarType.MULTIPLE,
        timeSpans: createTimeTablePayload(timeTable, dateStart),
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
        id: parseOfferId(cinemas[0]['@id']),
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

    if (productions[0].customOption) {
      await createWithEventsMutation.mutateAsync({
        productionName: productions[0].name,
        eventIds: [eventId],
      });
    } else {
      await addEventByIdMutation.mutateAsync({
        productionId: productions[0].production_id,
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

  const theme = watch('theme');
  const timeTable = watch('timeTable');
  const dateStart = watch('dateStart');
  const cinema = watch('cinema');
  const production = watch('production');

  const isTimeTableValid = useMemo(
    () =>
      !timeTable.some((row) =>
        row.some((cell) => cell !== null && !isMatch(cell, "HH'h'mm'm'")),
      ),
    [timeTable],
  );

  const submitEditedField = (editedField: keyof FormData) => {
    setFieldLoading(editedField);
    handleSubmit(async (formData) => handleFormValid(formData, editedField))();
  };

  useEffect(() => {
    if (!newEventId) return;
    submitEditedField('theme');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  useEffect(() => {
    if (!newEventId || !isTimeTableValid) return;
    submitEditedField('timeTable');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeTable]);

  useEffect(() => {
    if (!newEventId) return;
    submitEditedField('cinema');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cinema]);

  useEffect(() => {
    if (!newEventId) return;
    submitEditedField('production');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [production]);

  const stepProps = (field?: keyof FormData) => ({
    errors,
    control,
    getValues,
    register,
    reset,
    loading: !!(field && fieldLoading === field),
  });

  const isStep3Visible =
    (dirtyFields.timeTable &&
      timeTable.some((row) => row.some((cell) => !!cell))) ||
    dirtyFields.cinema;
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
      <Page.Content spacing={5} paddingBottom={6} alignItems="flex-start">
        <Step1 {...stepProps('theme')} />
        <Step2
          {...{
            ...stepProps('timeTable'),
            dateStart,
            onDateStartChange: (value) =>
              setValue('dateStart', value.toISOString()),
          }}
        />
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
                onClick={handleSubmit(async (formData) =>
                  handleFormValid(formData),
                )}
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

export default Create;
export type { StepProps };
