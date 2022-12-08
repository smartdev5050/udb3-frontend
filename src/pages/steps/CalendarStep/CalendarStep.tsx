import { useCallback, useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { BookingAvailabilityType } from '@/constants/BookingAvailabilityType';
import { CalendarType } from '@/constants/CalendarType';
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

const convertStateToFormData = (state: CalendarState) => {
  if (!state) return undefined;

  const { context } = state;
  const { days, openingHours, startDate, endDate } = context;

  const isSingle = state.matches('single');
  const isMultiple = state.matches('multiple');
  const isPeriodic = state.matches('periodic');
  const isPermanent = state.matches('permanent');

  const isOneOrMoreDays = isSingle || isMultiple;
  const isFixedDays = isPeriodic || isPermanent;

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
    ...(isSingle && { calendarType: CalendarType.SINGLE }),
    ...(isMultiple && { calendarType: CalendarType.MULTIPLE }),
    ...(isPeriodic && { calendarType: CalendarType.PERIODIC }),
    ...(isPermanent && { calendarType: CalendarType.PERMANENT }),
    ...(isOneOrMoreDays && { subEvent }),
    ...(isFixedDays && { openingHours: newOpeningHours }),
    ...(isPeriodic && {
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    }),
  };
};

type CalendarStepProps<
  TFormData extends FormDataUnion
> = StepProps<TFormData> & { offerId?: string };

const CalendarStep = <TFormData extends FormDataUnion>({
  offerId,
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
    if (offerId) return;
    handleLoadInitialContext();
  }, [offerId, handleLoadInitialContext]);

  const getEventByIdQuery = useGetEventByIdQuery({ id: offerId });

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
    onSuccess: () => {
      // only trigger toast in edit mode
      if (!offerId) return;
      toast.trigger('calendar');
    },
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

    console.log('GOING TO MUTATE');
    await changeCalendarMutation.mutateAsync({
      id: offerId,
      calendarType,
      ...formData,
    });
  };

  const handleSubmitCalendarMutationCallback = useCallback(
    handleSubmitCalendarMutation,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [calendarStateType, convertedStateToFormData, offerId],
  );

  useEffect(() => {
    if (!offerId) return;
    if (isIdle) return;
    if (previousState === 'idle') return;

    handleSubmitCalendarMutationCallback(isIdle);
  }, [offerId, handleSubmitCalendarMutationCallback, isIdle, previousState]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChooseFixedDaysCallback = useCallback(handleChooseFixedDays, []);

  useEffect(() => {
    if (isIdle) return;
    if (watchedValues.scope !== OfferType.PLACES) return;

    handleChooseFixedDaysCallback();
  }, [watchedValues.scope, isIdle, handleChooseFixedDaysCallback]);

  return (
    <Stack
      spacing={4}
      maxWidth={{ l: '100%', default: '50%' }}
      {...getStackProps(props)}
    >
      {watchedValues.scope === OfferType.EVENTS && (
        <CalendarOptionToggle
          onChooseOneOrMoreDays={handleChooseOneOrMoreDays}
          onChooseFixedDays={handleChooseFixedDays}
          width="100%"
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
