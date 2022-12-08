import { useCallback, useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { BookingAvailabilityType } from '@/constants/BookingAvailabilityType';
import { OfferStatus } from '@/constants/OfferStatus';
import { OfferType } from '@/constants/OfferType';
import {
  useChangeCalendarMutation,
  useGetEventByIdQuery,
} from '@/hooks/api/events';
import { useToast } from '@/pages/manage/movies/useToast';
import { Event } from '@/types/Event';
import { Panel } from '@/ui/Panel';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Toast } from '@/ui/Toast';

import {
  CalendarState,
  createDayId,
  createOpeninghoursId,
  initialCalendarContext,
  useCalendarSelector,
  useIsFixedDays,
  useIsIdle,
  useIsOneOrMoreDays,
} from '../machines/calendarMachine';
import { useCalendarHandlers } from '../machines/useCalendarHandlers';
import { FormDataUnion, StepProps, StepsConfiguration } from '../Steps';
import { CalendarOptionToggle } from './CalendarOptionToggle';
import { FixedDays } from './FixedDays';
import { OneOrMoreDays } from './OneOrMoreDays';

type CalendarStepProps<
  TFormData extends FormDataUnion
> = StepProps<TFormData> & { eventId?: string };

const convertStateToFormData = (state: CalendarState) => {
  if (!state) return undefined;

  const { context } = state;
  const { days, openingHours, startDate, endDate } = context;
  const isOneOrMoreDays = state.matches('single') || state.matches('multiple');
  const isFixedDays = state.matches('periodic') || state.matches('permanent');
  const isPeriodic = state.matches('periodic');

  const subEvent = days.map((day) => ({
    startDate: new Date(day.startDate).toISOString(),
    endDate: new Date(day.endDate).toISOString(),
    bookingAvailability: {
      type: BookingAvailabilityType.AVAILABLE,
    }, // Always available or depends on current state?
    status: {
      type: OfferStatus.AVAILABLE,
    },
  }));

  const newOpeningHours = openingHours.map((openingHour) => ({
    opens: openingHour.opens,
    closes: openingHour.closes,
    dayOfWeek: openingHour.dayOfWeek,
  }));

  return {
    ...(isOneOrMoreDays && { subEvent }),
    ...(isFixedDays && { openingHours: newOpeningHours }),
    ...(isPeriodic && {
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    }),
  };
};

const CalendarStep = <TFormData extends FormDataUnion>({
  eventId,
  control,
  ...props
}: CalendarStepProps<TFormData>) => {
  const { t } = useTranslation();

  const watchedValues = useWatch({ control });

  const isOneOrMoreDays = useIsOneOrMoreDays();
  const isFixedDays = useIsFixedDays();
  const isIdle = useIsIdle();

  const startDate = useCalendarSelector((state) => state.context.startDate);
  const endDate = useCalendarSelector((state) => state.context.endDate);
  const calendarStateType = useCalendarSelector((state) => state.value);
  const days = useCalendarSelector((state) => state.context.days);
  const state = useCalendarSelector((state) => state);
  const openingHours = useCalendarSelector(
    (state) => state.context.openingHours,
  );
  const previousState = useCalendarSelector((state) => state.history?.value);

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
    handleChooseFixedDays,
    handleChooseWithStartAndEndDate,
    handleChoosePermanent,
    handleChangeOpeningHours,
  } = useCalendarHandlers();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleLoadInitialContext = useCallback(loadInitialContext, []);

  useEffect(() => {
    if (eventId) return;
    handleLoadInitialContext();
  }, [eventId, handleLoadInitialContext]);

  const getEventByIdQuery = useGetEventByIdQuery({ id: eventId });

  // @ts-expect-error
  const event: Event | undefined = getEventByIdQuery.data;

  useEffect(() => {
    const initialContext = initialCalendarContext;

    if (!event) return;

    const days = (event.subEvent ?? []).map((subEvent) => ({
      id: createDayId(),
      startDate: subEvent.startDate,
      endDate: subEvent.endDate,
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
    onSuccess: () => toast.trigger('calendar'),
  });

  const convertedStateToFormData = useMemo(() => {
    if (!state) return;

    return convertStateToFormData(state);
  }, [state]);

  const handleSubmitCalendarMutation = async (isIdle: boolean) => {
    if (isIdle) return;

    const formData = convertedStateToFormData;

    const calendarType =
      typeof calendarStateType === 'string'
        ? calendarStateType
        : Object.keys(calendarStateType)[0];

    await changeCalendarMutation.mutateAsync({
      id: eventId,
      calendarType,
      ...formData,
    });
  };

  const handleSubmitCalendarMutationCallback = useCallback(
    handleSubmitCalendarMutation,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [calendarStateType, convertedStateToFormData, eventId],
  );

  useEffect(() => {
    if (!eventId) return;
    if (isIdle) return;
    if (previousState === 'idle') return;

    handleSubmitCalendarMutationCallback(isIdle);
  }, [
    eventId,
    days,
    openingHours,
    startDate,
    endDate,
    isIdle,
    previousState,
    handleSubmitCalendarMutationCallback,
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChooseFixedDaysCallback = useCallback(handleChooseFixedDays, []);

  useEffect(() => {
    if (isIdle) return;
    if (watchedValues.scope !== OfferType.PLACES) return;

    handleChooseFixedDaysCallback();
  }, [watchedValues.scope, isIdle, handleChooseFixedDaysCallback]);

  return (
    <Stack spacing={4} {...getStackProps(props)}>
      {watchedValues.scope === OfferType.EVENTS && (
        <CalendarOptionToggle
          onChooseOneOrMoreDays={handleChooseOneOrMoreDays}
          onChooseFixedDays={handleChooseFixedDays}
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

const calendarStepConfiguration: StepsConfiguration<FormDataUnion> = {
  // eslint-disable-next-line react/display-name
  Component: (props) => <CalendarStep {...props} />,
  name: 'calendar',
  title: ({ t }) => t('create.calendar.title'),
  shouldShowStep: ({ watch }) => {
    return !!watch('typeAndTheme.type.id');
  },
};

export { CalendarStep, calendarStepConfiguration, convertStateToFormData };