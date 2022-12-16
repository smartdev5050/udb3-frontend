import { useGetPlaceByIdQuery } from '@/hooks/api/places';

const useGetPlace = ({ id, onSuccess, enabled }) => {
  const getPlaceByIdQuery = useGetPlaceByIdQuery(
    { id },
    { onSuccess, enabled: !!id && !!enabled },
  );

  // @ts-expect-error
  return getPlaceByIdQuery?.data;
};

export { useGetPlace };
