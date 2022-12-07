import { OfferType } from '@/constants/OfferType';
import {
  useAddEventMutation,
  useAddLabelMutation,
  useChangeTypicalAgeRangeMutation,
} from '@/hooks/api/events';
import { useAddPlaceMutation } from '@/hooks/api/places';
import {
  useAddEventByIdMutation as useAddEventToProductionByIdMutation,
  useCreateWithEventsMutation as useCreateProductionWithEventsMutation,
} from '@/hooks/api/productions';
import { FormDataUnion } from '@/pages/steps/Steps';
import { isEvent } from '@/types/Event';

const useAddOffer = <TFormData extends FormDataUnion>({
  onSuccess,
  convertFormDataToOffer,
  label,
}) => {
  const addEventMutation = useAddEventMutation();
  const addPlaceMutation = useAddPlaceMutation();
  const changeTypicalAgeRangeMutation = useChangeTypicalAgeRangeMutation();
  const addLabelMutation = useAddLabelMutation();

  const createProductionWithEventsMutation = useCreateProductionWithEventsMutation();
  const addEventToProductionByIdMutation = useAddEventToProductionByIdMutation();

  return async (formData: TFormData) => {
    const { scope, production } = formData;

    if (!production && !formData.nameAndAgeRange.name) return;

    const payload = convertFormDataToOffer(formData);

    const addOfferMutation =
      scope === OfferType.EVENTS ? addEventMutation : addPlaceMutation;

    const { eventId, placeId } = await addOfferMutation.mutateAsync(payload);

    if (!eventId && !placeId) return;

    // @ts-expect-error
    if (eventId && !production?.typicalAgeRange) {
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

    if (!production) {
      onSuccess(eventId || placeId);
      return;
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

export { useAddOffer };
