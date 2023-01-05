import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useQueryClient } from 'react-query';

import { isEvent } from '@/types/Event';
import { isPlace } from '@/types/Place';

const FooterStatus = {
  HIDDEN: 'HIDDEN',
  PUBLISH: 'PUBLISH',
  MANUAL_SAVE: 'MANUAL_SAVE',
  AUTO_SAVE: 'AUTO_SAVE',
} as const;

const useFooterStatus = ({ offer, form }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    formState: { dirtyFields },
  } = form;

  const isMutating = queryClient.isMutating();
  const offerId = offer?.['@id'];
  const availableFrom = offer?.availableFrom;
  const isPlaceDirty = dirtyFields.place || dirtyFields.location;
  const isEventType = isEvent(offer);
  const isPlaceType = isPlace(offer);

  const footerStatus = useMemo(() => {
    if (offerId && isEventType && !availableFrom) {
      return FooterStatus.PUBLISH;
    }
    if (offerId && isPlaceType) {
      return FooterStatus.PUBLISH;
    }
    if (router.route.includes('edit')) return FooterStatus.AUTO_SAVE;
    if (isMutating) return FooterStatus.HIDDEN;
    if (isPlaceDirty) return FooterStatus.MANUAL_SAVE;
    return FooterStatus.HIDDEN;
  }, [
    offerId,
    isEventType,
    availableFrom,
    isPlaceType,
    router.route,
    isMutating,
    isPlaceDirty,
  ]);

  // scroll effect
  useEffect(() => {
    if (footerStatus !== FooterStatus.HIDDEN) {
      const main = document.querySelector('main');
      main.scroll({ left: 0, top: main.scrollHeight, behavior: 'smooth' });
    }
  }, [footerStatus]);

  return footerStatus;
};

export { FooterStatus, useFooterStatus };
