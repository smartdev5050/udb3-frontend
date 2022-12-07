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
  const fetchedOfferId = offer?.['@id'];
  const availableFrom = offer?.availableFrom;
  const isPlaceDirty = dirtyFields.place || dirtyFields.location;

  const footerStatus = useMemo(() => {
    if (fetchedOfferId && isEvent(offer) && !availableFrom) {
      return FooterStatus.PUBLISH;
    }
    if (fetchedOfferId && isPlace(offer)) {
      return FooterStatus.PUBLISH;
    }
    if (router.route.includes('edit')) return FooterStatus.AUTO_SAVE;
    if (isMutating) return FooterStatus.HIDDEN;
    if (isPlaceDirty) return FooterStatus.MANUAL_SAVE;
    return FooterStatus.HIDDEN;
  }, [
    fetchedOfferId,
    offer,
    availableFrom,
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
