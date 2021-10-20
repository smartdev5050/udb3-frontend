import { yupResolver } from '@hookform/resolvers/yup';
import { addDays, set as setTime } from 'date-fns';
import { useState } from 'react';
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
  useChangeTypicalAgeRange,
  usePublish,
} from '@/hooks/api/events';
import { useAddEventById, useCreateWithEvents } from '@/hooks/api/productions';
import type { Place } from '@/types/Place';
import type { Production } from '@/types/Production';
import { WorkflowStatusMap } from '@/types/WorkflowStatus';
import { Button, ButtonVariants } from '@/ui/Button';
import { Page } from '@/ui/Page';
import { formatDateToISO } from '@/utils/formatDateToISO';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';
import { parseOfferId } from '@/utils/parseOfferId';

import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Step4 } from './Step4';
import { Step5 } from './Step5';

type Time = string;

const createTimeTablePayload = (timeTable: Time[][], dateStart: Date) =>
  timeTable.reduce((acc, row, rowIndex) => {
    const onlyTimeStrings = row.reduce((acc, time) => {
      if (!time || !/[0-2][0-4]h[0-5][0-9]m/.test(time)) {
        return acc;
      }

      const hours = parseInt(time.substring(0, 2));
      const minutes = parseInt(time.substring(3, 5));
      const rowDate = addDays(dateStart, rowIndex);
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
    dateStart: yup.date().required(),
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
  dateStart: Date;
};

type StepProps = Pick<
  UseFormReturn<FormData>,
  'control' | 'getValues' | 'register' | 'reset'
> & {
  errors: Partial<Record<keyof FormData, any>>;
};

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
      dateStart: new Date(),
    },
  });

  const { t, i18n } = useTranslation();

  const queryClient = useQueryClient();

  const [newEventId, setNewEventId] = useState('');

  const addEventMutation = useAddEvent({
    onSuccess: async () => await queryClient.invalidateQueries('events'),
  });

  const addEventByIdMutation = useAddEventById();

  const changeTypicalAgeRangeMutation = useChangeTypicalAgeRange();

  const addLabelMutation = useAddLabel();

  const createWithEventsMutation = useCreateWithEvents();

  const publishMutation = usePublish();

  const handleFormValid = async ({
    production: productions,
    cinema: cinemas,
    theme: themeId,
    timeTable,
    dateStart,
  }: FormData) => {
    if (!productions.length) return;

    const [themeLabel] = Object.entries(MovieThemes).find(
      ([key, value]) => value === themeId,
    );

    const variables: EventArguments = {
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
      theme: {
        id: themeId,
        label: themeLabel,
        domain: 'theme',
      },
      location: {
        id: parseOfferId(cinemas[0]['@id']),
      },
      workflowStatus: WorkflowStatusMap.DRAFT,
      audienceType: 'everyone',
    };

    const { eventId } = await addEventMutation.mutateAsync(variables);

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

  const handleClickPublishLater = () => {};

  const filledInTimeTable = watch('timeTable');
  const dateStart = watch('dateStart');

  const stepProps = {
    errors,
    control,
    getValues,
    register,
    reset,
  };

  const isStep2Visible = dirtyFields.theme || dirtyFields.cinema;
  const isStep3Visible =
    (dirtyFields.timeTable &&
      filledInTimeTable.some((row) => row.some((cell) => !!cell))) ||
    dirtyFields.cinema;
  const isStep4Visible = dirtyFields.cinema;
  const isSaveButtonVisible = dirtyFields.cinema;
  const isStep5Visible = !!newEventId && Object.values(errors).length === 0;

  return (
    <Page>
      <Page.Title spacing={3} alignItems="center">
        {t(`movies.create.title`)}
      </Page.Title>
      <Page.Content spacing={5} paddingBottom={6} alignItems="flex-start">
        <Step1 {...stepProps} />
        {isStep2Visible ? (
          <Step2
            {...{
              ...stepProps,
              dateStart,
              onDateStartChange: (value) => setValue('dateStart', value),
            }}
          />
        ) : null}
        {isStep3Visible ? <Step3 {...stepProps} /> : null}
        {isStep4Visible ? <Step4 {...stepProps} /> : null}
        {isSaveButtonVisible ? (
          <Button onClick={handleSubmit(handleFormValid)}>
            {t('movies.create.actions.save')}
          </Button>
        ) : null}
        {isStep5Visible ? (
          <Step5 {...{ ...stepProps, eventId: newEventId }} />
        ) : null}
      </Page.Content>
      {newEventId ? (
        <Page.Footer>
          <Button variant={ButtonVariants.SUCCESS} onClick={handleClickPublish}>
            {t('movies.create.actions.publish')}
          </Button>
          <Button
            variant={ButtonVariants.SECONDARY}
            onClick={handleClickPublishLater}
          >
            {t('movies.create.actions.publish_later')}
          </Button>
        </Page.Footer>
      ) : null}
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export default Create;
export type { StepProps };
