import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, AlertVariants } from '@/ui/Alert';
import { DatePicker } from '@/ui/DatePicker';
import { Modal, ModalSizes, ModalVariants } from '@/ui/Modal';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { usePublishOffer } from '@/pages/steps/hooks/usePublishOffer';
import { OfferType, OfferTypes } from '@/constants/OfferType';
import { useRouter } from 'next/router';
import { Offer } from '@/types/Offer';
import { useChangeAvailableFromMutation } from '@/hooks/api/events';

type Props = {
  scope: OfferType;
  visible: boolean;
  offer: Offer;
  offerId: string;
  onClose: () => void;
};

const PublishLaterModal = ({
  scope,
  visible,
  offer,
  offerId,
  onClose,
}: Props) => {
  const { t } = useTranslation();
  const { push } = useRouter();

  const changeAvailableFrom = useChangeAvailableFromMutation();
  const onSuccess = () => {
    const scopePath = scope === OfferTypes.EVENTS ? 'event' : 'place';
    push(`/${scopePath}/${offerId}/preview`);
  };

  const publishOffer = usePublishOffer({
    scope,
    id: offerId,
    onSuccess,
  });

  const [publishLaterDate, setPublishLaterDate] = useState(
    offer?.availableFrom ? new Date(offer?.availableFrom) : new Date(),
  );

  const handleConfirm = () =>
    offer?.availableFrom
      ? changeAvailableFrom.mutate(
          {
            id: offerId,
            availableFrom: publishLaterDate,
          },
          { onSuccess },
        )
      : publishOffer(publishLaterDate);

  return (
    <Modal
      variant={ModalVariants.QUESTION}
      visible={visible}
      onConfirm={handleConfirm}
      scrollable={false}
      onClose={onClose}
      title={t('create.publish_modal.title')}
      confirmTitle={t('create.publish_modal.actions.confirm')}
      cancelTitle={t('create.publish_modal.actions.cancel')}
      confirmButtonDisabled={!publishLaterDate}
      size={ModalSizes.MD}
    >
      <Stack padding={4} spacing={4} alignItems="flex-start">
        <Text>{t('create.publish_modal.description')}</Text>
        <Alert variant={AlertVariants.WARNING}>
          {t('create.publish_modal.warning')}
        </Alert>
        <DatePicker
          id="publish-later-date"
          selected={publishLaterDate}
          onChange={setPublishLaterDate}
          maxWidth="16rem"
          minDate={new Date()}
        />
      </Stack>
    </Modal>
  );
};

export { PublishLaterModal };
