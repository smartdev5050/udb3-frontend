import { useGetPlaceByIdQuery } from '@/hooks/api/places';

const useGetPlace = ({ id, onSuccess }) => {
  const getPlaceByIdQuery = useGetPlaceByIdQuery({ id }, { onSuccess });

  // @ts-expect-error
  return getPlaceByIdQuery?.data;
};

export { useGetPlace };
