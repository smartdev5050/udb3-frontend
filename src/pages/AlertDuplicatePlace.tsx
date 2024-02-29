import { Trans, useTranslation } from 'react-i18next';

import { OfferTypes } from '@/constants/OfferType';
import { useGetPlaceByIdQuery } from '@/hooks/api/places';
import { Place } from '@/types/Place';
import { Values } from '@/types/Values';
import { Alert, AlertVariants } from '@/ui/Alert';
import { Button, ButtonVariants } from '@/ui/Button';
import { getLanguageObjectOrFallback } from '@/utils/getLanguageObjectOrFallback';

import { SupportedLanguage } from '../i18n';

type Props = {
  variant: Values<typeof AlertVariants>;
  placeId?: string;
  query?: string;
  labelKey: string;
  onSelectPlace: (place: Place) => void;
};

const AlertDuplicatePlace = ({
  variant,
  placeId,
  query,
  labelKey,
  onSelectPlace,
}: Props) => {
  const { t, i18n } = useTranslation();

  const getPlaceByIdQuery = useGetPlaceByIdQuery({
    id: placeId,
    scope: OfferTypes.PLACES,
  });

  // @ts-expect-error
  const duplicatePlace = getPlaceByIdQuery.data;

  const duplicatePlaceName = getLanguageObjectOrFallback(
    duplicatePlace?.name,
    i18n.language as SupportedLanguage,
    duplicatePlace.mainLanguage,
  );

  if (query) {
    return (
      <Alert variant={variant}>
        {t('location.add_modal.errors.duplicate_place_generic')}
      </Alert>
    );
  }

  if (!placeId) {
    return null;
  }

  return (
    <Alert variant={variant}>
      <Trans
        i18nKey={labelKey}
        values={{
          placeName: duplicatePlaceName,
        }}
        components={{
          placeLink: (
            <Button
              variant={ButtonVariants.UNSTYLED}
              onClick={() => onSelectPlace(duplicatePlace)}
              display={'inline-block'}
              fontWeight={'bold'}
              textDecoration={'underline'}
              padding={0}
            />
          ),
        }}
      />
    </Alert>
  );
};

export { AlertDuplicatePlace };
