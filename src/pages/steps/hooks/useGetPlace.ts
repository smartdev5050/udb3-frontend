import { OfferTypes } from '@/constants/OfferType';
import { useGetPlaceByIdQuery } from '@/hooks/api/places';

const useGetPlace = ({ id, onSuccess, enabled }) => {
  const getPlaceByIdQuery = useGetPlaceByIdQuery(
    { id, scope: OfferTypes.PLACES },
    { onSuccess, enabled: !!id && !!enabled },
  );

  // @ts-expect-error
  return getPlaceByIdQuery?.data;
};

export { useGetPlace };
