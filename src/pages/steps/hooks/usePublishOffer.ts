import { useMemo } from 'react';
import { useQueryClient } from 'react-query';

import { OfferTypes } from '@/constants/OfferType';
import { usePublishEventMutation } from '@/hooks/api/events';
import { usePublishPlaceMutation } from '@/hooks/api/places';
import { formatDateToISO } from '@/utils/formatDateToISO';

const usePublishOffer = ({ scope, id, onSuccess }) => {
  const queryClient = useQueryClient();

  const usePublishMutation = useMemo(
    () =>
      scope === OfferTypes.EVENTS
        ? usePublishEventMutation
        : usePublishPlaceMutation,
    [scope],
  );

  const publishMutation = usePublishMutation({
    onSuccess: () => {
      queryClient.invalidateQueries([
        scope === OfferTypes.EVENTS ? 'events' : 'places',
        { id },
      ]);
      onSuccess();
    },
  });

  return async (date: Date = new Date()) => {
    if (!id) return;

    await publishMutation.mutateAsync({
      eventId: id,
      publicationDate: formatDateToISO(date),
    });
  };
};

export { usePublishOffer };
