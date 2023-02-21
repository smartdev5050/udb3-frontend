import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { CalendarType } from '@/constants/CalendarType';
import { OfferStatus } from '@/constants/OfferStatus';
import { OfferTypes } from '@/constants/OfferType';
import { useGetEventByIdQuery } from '@/hooks/api/events';
import { useChangeOfferCalendarMutation } from '@/hooks/api/offers';
import { useGetPlaceByIdQuery } from '@/hooks/api/places';
import { useToast } from '@/pages/manage/movies/useToast';
import { Event } from '@/types/Event';
import { SubEvent } from '@/types/Offer';
import { Values } from '@/types/Values';
import { Panel } from '@/ui/Panel';
import { getStackProps, Stack } from '@/ui/Stack';
import { Toast } from '@/ui/Toast';
import { formatDateToISO } from '@/utils/formatDateToISO';

import { UseEditArguments } from '../hooks/useEditField';
import {
  CalendarContext,
  CalendarState,
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

const useEditCalendar = ({ offerId, onSuccess }: UseEditArguments) => {
  const changeCalendarMutation = useChangeOfferCalendarMutation({
    onSuccess: () =>
      onSuccess('calendar', {
        shouldInvalidateEvent: false,
      }),
  });

  return async ({ scope, calendar, timeTable }: FormDataUnion) => {
    const common = {
      id: offerId,
      scope,
    };

    if (timeTable) {
      const subEvent = convertTimeTableToSubEvents(timeTable);

      await changeCalendarMutation.mutateAsync({
        ...common,
        subEvent,
        calendarType:
          subEvent.length > 1 ? CalendarType.MULTIPLE : CalendarType.SINGLE,
      });

      return;
    }

    await changeCalendarMutation.mutateAsync({
      ...common,
      ...calendar,
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
    startDate: formatDateToISO(new Date(day.startDate)),
    endDate: formatDateToISO(new Date(day.endDate)),
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
      startDate: formatDateToISO(new Date(startDate || undefined)),
      endDate: formatDateToISO(new Date(endDate || undefined)),
    }),
  };
};

type CalendarInForm = ReturnType<typeof convertStateToFormData>;

type CalendarStepProps = StepProps & { offerId?: string };

const CalendarStep = ({
  offerId,
  control,
  setValue,
  formState: { errors },
  onChange,
  ...props
}: CalendarStepProps) => {
  const { t } = useTranslation();

  const calendarStepContainer = useRef(null);

  const [scope, type] = useWatch({
    control,
    name: ['scope', 'typeAndTheme.type'],
  });

  const calendarService = useCalendarContext();

  const isOneOrMoreDays = useIsOneOrMoreDays();
  const isFixedDays = useIsFixedDays();
  const isIdle = useIsIdle();
  const days = useCalendarSelector((state) => state.context.days);

  const hasUnavailableSubEvent = useMemo(
    () => days.some((day) => day.status.type !== OfferStatus.AVAILABLE),
    [days],
  );

  const handleChangeCalendarState = (newState: CalendarState) => {
    const calendarType = Object.values(CalendarType).find((type) =>
      newState.matches(type),
    );

    const formData = convertStateToFormData(newState.context, calendarType);

    setValue('calendar', formData, {
      shouldTouch: true,
      shouldDirty: true,
      shouldValidate: true,
    });

    const wasIdle = newState.history ? newState.history.matches('idle') : true;

    if (wasIdle) {
      return;
    }

    onChange(formData);
  };

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
  } = useCalendarHandlers(handleChangeCalendarState);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleLoadInitialContext = useCallback(loadInitialContext, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChooseFixedDays = useCallback(chooseFixedDays, []);

  useEffect(() => {
    calendarService.start();

    return () => {
      calendarService.stop();
    };
  }, [calendarService]);

  useEffect(() => {
    if (offerId) return;

    handleLoadInitialContext({
      ...(scope === OfferTypes.PLACES && {
        calendarType: CalendarType.PERMANENT,
      }),
    });
  }, [handleLoadInitialContext, scope, offerId]);

  const useGetOfferByIdQuery =
    scope === OfferTypes.EVENTS ? useGetEventByIdQuery : useGetPlaceByIdQuery;

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

    handleLoadInitialContext({ newContext, calendarType: event.calendarType });
  }, [event, handleLoadInitialContext]);

  const toast = useToast({
    messages: { calendar: t('create.toast.success.calendar') },
  });

  const scrollToCalendarContainer = () => {
    if (!calendarStepContainer.current) {
      return;
    }

    calendarStepContainer.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  useEffect(() => {
    if (isIdle) return;
    if (scope !== OfferTypes.PLACES) return;

    handleChooseFixedDays();
  }, [scope, isIdle, handleChooseFixedDays]);

  // scroll to calendar step after theme has been selected
  useEffect(() => {
    if (!scope || !type.id) return;
    if (offerId) return;

    scrollToCalendarContainer();
  }, [scope, offerId, type]);

  return (
    <Stack
      ref={calendarStepContainer}
      spacing={4}
      minWidth={{ l: 'auto', default: '60rem' }}
      width={{ l: '100%', default: 'min-content' }}
      {...getStackProps(props)}
    >
      {scope === OfferTypes.EVENTS && (
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
            onChangeCalendarState={handleChangeCalendarState}
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
            errors={errors}
          />
        )}
      </Panel>
      <Toast
        variant="success"
        body={toast.message}
        visible={!!toast.message}
        onClose={() => toast.clear()}
      />
    </Stack>
  );
};

const calendarStepConfiguration: StepsConfiguration<'calendar'> = {
  Component: CalendarStep,
  name: 'calendar',
  title: ({ t, scope }) => t(`create.calendar.title.${scope}`),
  shouldShowStep: ({ watch }) => {
    return !!watch('typeAndTheme.type.id');
  },
  validation: yup.object().shape({
    subEvent: yup
      .array()
      .test(
        'invalid-hours',
        "Hours weren't valid",
        (subEvent: SubEvent[] | undefined, context) => {
          if (!subEvent) {
            return true;
          }

          const errors = subEvent
            .map((sub, index) => {
              const startDate = new Date(sub.startDate);
              const endDate = new Date(sub.endDate);
              const startTime = startDate.getTime();
              const endTime = endDate.getTime();

              if (startTime > endTime) {
                return context.createError({
                  path: `${context.path}.${index}`,
                  message: 'Invalid times',
                });
              }
            })
            .filter(Boolean);

          return errors.length > 0 ? new yup.ValidationError(errors) : true;
        },
      ),
  }),
};

export type { CalendarInForm };
export {
  CalendarStep,
  calendarStepConfiguration,
  convertStateToFormData,
  useEditCalendar,
};
