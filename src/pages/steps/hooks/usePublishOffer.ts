import { useQueryClient } from 'react-query';

import { OfferTypes } from '@/constants/OfferType';
import { usePublishEventMutation } from '@/hooks/api/events';
import { usePublishPlaceMutation } from '@/hooks/api/places';
import { formatDateToISO } from '@/utils/formatDateToISO';

const usePublishOffer = ({ scope, id, onSuccess }) => {
  const queryClient = useQueryClient();

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries([
        scope === OfferTypes.EVENTS ? 'events' : 'places',
        { id },
      ]);
      onSuccess();
    },
  };

  const eventMutation = usePublishEventMutation(mutationOptions);
  const placeMutation = usePublishPlaceMutation(mutationOptions);

  const publishMutation =
    scope === OfferTypes.EVENTS ? eventMutation : placeMutation;

  return async (date: Date = new Date()) => {
    if (!id) return;

    await publishMutation.mutateAsync({
      id,
      publicationDate: formatDateToISO(date),
    });
  };
};

export { usePublishOffer };
