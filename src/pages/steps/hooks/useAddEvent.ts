import {
  useAddEventMutation,
  useAddLabelMutation,
  useChangeTypicalAgeRangeMutation,
} from '@/hooks/api/events';
import {
  useAddEventByIdMutation as useAddEventToProductionByIdMutation,
  useCreateWithEventsMutation as useCreateProductionWithEventsMutation,
} from '@/hooks/api/productions';
import { FormDataIntersection } from '@/pages/steps/Steps';

const useAddEvent = <TFormData extends FormDataIntersection>({
  onSuccess,
  convertFormDataToEvent,
  label,
}) => {
  const addEventMutation = useAddEventMutation();
  const changeTypicalAgeRangeMutation = useChangeTypicalAgeRangeMutation();
  const addLabelMutation = useAddLabelMutation();

  const createProductionWithEventsMutation = useCreateProductionWithEventsMutation();
  const addEventToProductionByIdMutation = useAddEventToProductionByIdMutation();

  return async (formData: TFormData) => {
    const { production } = formData;

    if (!production) return;

    const payload = convertFormDataToEvent(formData);

    const { eventId } = await addEventMutation.mutateAsync(payload);

    if (!eventId) return;

    // @ts-expect-error
    if (!production?.typicalAgeRange) {
      await changeTypicalAgeRangeMutation.mutateAsync({
        eventId,
        typicalAgeRange: '-',
      });
    }

    if (label) {
      await addLabelMutation.mutateAsync({
        eventId,
        label,
      });
    }

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
