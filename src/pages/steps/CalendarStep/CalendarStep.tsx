import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { CalendarType } from '@/constants/CalendarType';
import { OfferStatus } from '@/constants/OfferStatus';
import { OfferType } from '@/constants/OfferType';
import {
  useChangeCalendarMutation,
  useGetEventByIdQuery,
} from '@/hooks/api/events';
import { useChangeOfferCalendarMutation } from '@/hooks/api/offers';
import { useGetPlaceByIdQuery } from '@/hooks/api/places';
import { useToast } from '@/pages/manage/movies/useToast';
import { Event } from '@/types/Event';
import { Values } from '@/types/Values';
import { Panel } from '@/ui/Panel';
import { getStackProps, Stack } from '@/ui/Stack';
import { Toast } from '@/ui/Toast';

import {
  CalendarContext,
  createDayId,
  createOpeninghoursId,
  initialCalendarContext,
  useCalendarContext,
  useCalendarSelector,
  useIsFixedDays,
  useIsIdle,
  useIsOneOrMoreDays,
} from '../machines/calendarMachine';
import { useCalendarHandlers } from '../machines/useCalendarHandlers';
import { FormDataUnion, StepProps, StepsConfiguration } from '../Steps';
import { convertTimeTableToSubEvents } from '../TimeTableStep';
import { CalendarOptionToggle } from './CalendarOptionToggle';
import { FixedDays } from './FixedDays';
import { OneOrMoreDays } from './OneOrMoreDays';
import { useCalendarType } from './useCalendarType';

const useEditCalendar = ({ offerId, onSuccess }) => {
  const changeCalendarMutation = useChangeOfferCalendarMutation({
    onSuccess: () => onSuccess('calendar', { shouldInvalidateEvent: false }),
  });

  return async ({ scope, calendar, timeTable }: FormDataUnion) => {
    const subEvent = convertTimeTableToSubEvents(timeTable);

    await changeCalendarMutation.mutateAsync({
      id: offerId,
      ...calendar,
      ...(timeTable && {
        subEvent,
        calendarType:
          subEvent.length > 1 ? CalendarType.MULTIPLE : CalendarType.SINGLE,
      }),
      scope,
    });
  };
};

const convertStateToFormData = (
  context: CalendarContext,
  calendarType: Values<typeof CalendarType>,
) => {
  if (!context) return undefined;

  const { days, openingHours, startDate, endDate } = context;

  const isOneOrMoreDays = (
    [CalendarType.SINGLE, CalendarType.MULTIPLE] as string[]
  ).includes(calendarType);

  const isFixedDays = (
    [CalendarType.PERIODIC, CalendarType.PERMANENT] as string[]
  ).includes(calendarType);

  const subEvent = days.map((day) => ({
    startDate: new Date(day.startDate).toISOString(),
    endDate: new Date(day.endDate).toISOString(),
    bookingAvailability: day.bookingAvailability,
    status: day.status,
  }));

  const newOpeningHours = openingHours.map((openingHour) => ({
    opens: openingHour.opens,
    closes: openingHour.closes,
    dayOfWeek: openingHour.dayOfWeek,
  }));

  return {
    calendarType,
    ...(isOneOrMoreDays && { subEvent }),
    ...(isFixedDays && { openingHours: newOpeningHours }),
    ...(calendarType === CalendarType.PERIODIC && {
      startDate: startDate
        ? new Date(startDate).toISOString()
        : new Date().toISOString(),
      endDate: endDate
        ? new Date(endDate).toISOString()
        : new Date().toISOString(),
    }),
  };
};

type CalendarStepProps = StepProps & { offerId?: string };

const CalendarStep = ({ offerId, control, ...props }: CalendarStepProps) => {
  const { t } = useTranslation();
  const { pathname } = useRouter();
  const postfix = pathname.split('/').at(-1);

  const scope = useWatch({ control, name: 'scope' });

  const calendarService = useCalendarContext();

  const isOneOrMoreDays = useIsOneOrMoreDays();
  const isFixedDays = useIsFixedDays();
  const wasIdle = useCalendarSelector(
    (state) => state.history?.matches('idle') ?? false,
  );
  const isIdle = useIsIdle();
  const days = useCalendarSelector((state) => state.context.days);
  const context = useCalendarSelector((state) => state.context);

  const hasUnavailableSubEvent = useMemo(
    () => days.some((day) => day.status.type !== OfferStatus.AVAILABLE),
    [days],
  );

  const {
    handleLoadInitialContext: loadInitialContext,
    handleAddDay,
    handleDeleteDay,
    handleChangeStartDate,
    handleChangeEndDate,
    handleChangeStartDateOfDay,
    handleChangeEndDateOfDay,
    handleChangeStartTime,
    handleChangeEndTime,
    handleChooseOneOrMoreDays,
    handleChooseFixedDays: chooseFixedDays,
    handleChooseWithStartAndEndDate,
    handleChoosePermanent,
    handleChangeOpeningHours,
  } = useCalendarHandlers();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleLoadInitialContext = useCallback(loadInitialContext, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChooseFixedDays = useCallback(chooseFixedDays, []);

  useEffect(() => {
    if (postfix !== 'create') return;

    calendarService.stop();
    calendarService.start();
  }, [calendarService, postfix]);

  useEffect(() => {
    if (offerId) return;

    handleLoadInitialContext();
  }, [handleLoadInitialContext, offerId]);

  const useGetOfferByIdQuery =
    scope === OfferType.EVENTS ? useGetEventByIdQuery : useGetPlaceByIdQuery;

  const getEventByIdQuery = useGetOfferByIdQuery({ id: offerId });

  // @ts-expect-error
  const event: Event | undefined = getEventByIdQuery.data;

  useEffect(() => {
    const initialContext = initialCalendarContext;

    if (!event) return;

    const days = (event.subEvent ?? []).map((subEvent) => ({
      id: createDayId(),
      startDate: subEvent.startDate,
      endDate: subEvent.endDate,
      status: subEvent.status,
      bookingAvailability: subEvent.bookingAvailability,
    }));

    const openingHours = (event.openingHours ?? []).map((openingHour) => ({
      id: createOpeninghoursId(),
      opens: openingHour.opens,
      closes: openingHour.closes,
      dayOfWeek: openingHour.dayOfWeek,
    }));

    const newContext = {
      ...initialContext,
      ...(days.length > 0 && { days }),
      ...(openingHours.length > 0 && { openingHours }),
      ...(event && { startDate: event.startDate ?? '' }),
      ...(event && { endDate: event.endDate ?? '' }),
    };

    handleLoadInitialContext(newContext, event.calendarType);
  }, [event, handleLoadInitialContext]);

  const toast = useToast({
    messages: { calendar: t('create.toast.success.calendar') },
    title: '',
  });

  const changeCalendarMutation = useChangeCalendarMutation({
    onSuccess: () => {
      // only trigger toast in edit mode
      if (!offerId) return;
      toast.trigger('calendar');
    },
  });

  const calendarType = useCalendarType();

  const convertedStateToFormData = useMemo(() => {
    if (!context || !calendarType) return;

    // TODO: Find a way to make this work without bypassing the rules of hooks
    // wasIdle must be included in the dependency array
    if (wasIdle) return;

    return convertStateToFormData(context, calendarType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, calendarType]);

  const submitCalendarMutation = async (formData: any) => {
    await changeCalendarMutation.mutateAsync({
      id: offerId,
      ...formData,
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSubmitCalendarMutation = useCallback(submitCalendarMutation, []);

  useEffect(() => {
    if (!offerId) return;
    if (!convertedStateToFormData) return;

    handleSubmitCalendarMutation(convertedStateToFormData);
  }, [convertedStateToFormData, handleSubmitCalendarMutation, offerId]);

  useEffect(() => {
    if (isIdle) return;
    if (scope !== OfferType.PLACES) return;

    handleChooseFixedDays();
  }, [scope, isIdle, handleChooseFixedDays]);

  return (
    <Stack
      spacing={4}
      minWidth={{ l: 'auto', default: '54rem' }}
      width={{ l: '100%', default: 'min-content' }}
      {...getStackProps(props)}
    >
      {scope === OfferType.EVENTS && (
        <CalendarOptionToggle
          onChooseOneOrMoreDays={handleChooseOneOrMoreDays}
          onChooseFixedDays={handleChooseFixedDays}
          width="100%"
          disableChooseFixedDays={hasUnavailableSubEvent}
        />
      )}
      <Panel backgroundColor="white" padding={5}>
        {isFixedDays && (
          <FixedDays
            onChooseWithStartAndEndDate={handleChooseWithStartAndEndDate}
            onChoosePermanent={handleChoosePermanent}
            onChangeStartDate={handleChangeStartDate}
            onChangeEndDate={handleChangeEndDate}
            onChangeOpeningHours={handleChangeOpeningHours}
          />
        )}
        {isOneOrMoreDays && (
          <OneOrMoreDays
            onDeleteDay={handleDeleteDay}
            onChangeStartDate={handleChangeStartDateOfDay}
            onChangeEndDate={handleChangeEndDateOfDay}
            onChangeStartTime={handleChangeStartTime}
            onChangeEndTime={handleChangeEndTime}
            onAddDay={handleAddDay}
          />
        )}
      </Panel>
      <Toast
        variant="success"
        header={toast.header}
        body={toast.message}
        visible={!!toast.message}
        onClose={() => toast.clear()}
      />
    </Stack>
  );
};

const calendarStepConfiguration: StepsConfiguration = {
  Component: CalendarStep,
  name: 'calendar',
  title: ({ t }) => t('create.calendar.title'),
  shouldShowStep: ({ watch }) => {
    return !!watch('typeAndTheme.type.id');
  },
};

export {
  CalendarStep,
  calendarStepConfiguration,
  convertStateToFormData,
  useEditCalendar,
};
