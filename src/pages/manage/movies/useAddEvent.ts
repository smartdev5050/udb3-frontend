import { CalendarType } from '@/constants/CalendarType';
import {
  EventArguments,
  useAddEventMutation,
  useAddLabelMutation,
  useChangeTypicalAgeRangeMutation,
} from '@/hooks/api/events';
import {
  useAddEventByIdMutation as useAddEventToProductionByIdMutation,
  useCreateWithEventsMutation as useCreateProductionWithEventsMutation,
} from '@/hooks/api/productions';
import { FormDataIntersection } from '@/pages/Steps';
import { convertTimeTableToSubEvents } from '@/pages/steps/TimeTableStep';
import { WorkflowStatusMap } from '@/types/WorkflowStatus';
import { parseOfferId } from '@/utils/parseOfferId';

const useAddEvent = <TFormData extends FormDataIntersection>({ onSuccess }) => {
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
  }: TFormData) => {
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

export { useAddEvent };
