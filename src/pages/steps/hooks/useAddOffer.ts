import { OfferType } from '@/constants/OfferType';
import {
  useAddEventMutation,
  useAddLabelMutation as useAddLabelOnEventMutation,
  useChangeTypicalAgeRangeMutation,
} from '@/hooks/api/events';
import {
  useAddLabelMutation as useAddLabelOnPlaceMutation,
  useAddPlaceMutation,
} from '@/hooks/api/places';
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

const useAddOffer = <TFormData extends FormDataUnion>({
  onSuccess,
  convertFormDataToOffer,
  label,
}: UseAddOfferArgument) => {
  const addEventMutation = useAddEventMutation();
  const addPlaceMutation = useAddPlaceMutation();

  const addLabelMutationOnEvent = useAddLabelOnEventMutation();
  const addLabelMutationOnPlace = useAddLabelOnPlaceMutation();

  const createProductionWithEventsMutation =
    useCreateProductionWithEventsMutation();
  const addEventToProductionByIdMutation =
    useAddEventToProductionByIdMutation();

  return async (formData: TFormData) => {
    const { scope, production } = formData;

    if (!production && !formData.nameAndAgeRange.name) return;

    const payload = convertFormDataToOffer(formData);

    const addOfferMutation =
      scope === OfferType.EVENTS ? addEventMutation : addPlaceMutation;

    const addLabelMutation =
      scope === OfferType.EVENTS
        ? addLabelMutationOnEvent
        : addLabelMutationOnPlace;

    const { eventId, placeId } = await addOfferMutation.mutateAsync(payload);

    const offerId: string = eventId || placeId;

    if (!offerId) return;

    if (label) {
      await addLabelMutation.mutateAsync({
        id: offerId,
        label,
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
