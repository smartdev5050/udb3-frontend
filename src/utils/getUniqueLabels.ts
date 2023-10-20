import { Offer } from '@/types/Offer';
import { Organizer } from '@/types/Organizer';

const getUniqueLabels = (entity: Organizer | Offer) => {
  const organizerLabelsSet = new Set([
    ...(entity?.labels ?? []),
    ...(entity?.hiddenLabels ?? []),
  ]);

  return [...organizerLabelsSet];
};

export { getUniqueLabels };
