import { OfferTypes } from '@/constants/OfferType';
import { useAddEventMutation } from '@/hooks/api/events';
import { useAddOfferLabelMutation } from '@/hooks/api/offers';
import { useAddPlaceMutation } from '@/hooks/api/places';
import {
  useAddEventByIdMutation as useAddEventToProductionByIdMutation,
  useCreateWithEventsMutation as useCreateProductionWithEventsMutation,
} from '@/hooks/api/productions';
import { FormDataUnion } from '@/pages/steps/Steps';

type UseAddOfferArgument = {
  onSuccess: (scope: FormDataUnion['scope'], offerId: string) => void;
  convertFormDataToOffer: (data: any) => any;
  label?: string;
};

const useAddOffer = ({
  onSuccess,
  convertFormDataToOffer,
  label,
}: UseAddOfferArgument) => {
  const addEventMutation = useAddEventMutation();
  const addPlaceMutation = useAddPlaceMutation();

  const addLabelMutation = useAddOfferLabelMutation();

  const createProductionWithEventsMutation =
    useCreateProductionWithEventsMutation();
  const addEventToProductionByIdMutation =
    useAddEventToProductionByIdMutation();

  return async (formData: FormDataUnion) => {
    const { scope, production } = formData;

    if (!production && !formData.nameAndAgeRange.name) return;

    const payload = convertFormDataToOffer(formData);

    const addOfferMutation =
      scope === OfferTypes.EVENTS ? addEventMutation : addPlaceMutation;

    const { eventId, placeId } = await addOfferMutation.mutateAsync(payload);

    const offerId: string = eventId || placeId;

    if (!offerId) return;

    if (label) {
      await addLabelMutation.mutateAsync({
        id: offerId,
        label,
        scope,
      });
    }

    if (!production) {
      onSuccess(scope, offerId);
      return;
    }

    if (production.customOption) {
      await createProductionWithEventsMutation.mutateAsync({
        productionName: production.name,
        eventIds: [offerId],
      });
    } else {
      await addEventToProductionByIdMutation.mutateAsync({
        productionId: production.production_id,
        eventId: offerId,
      });
    }

    onSuccess(scope, offerId);
  };
};

export { useAddOffer };
