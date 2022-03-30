import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, AlertVariants } from '@/ui/Alert';
import { DatePicker } from '@/ui/DatePicker';
import { Modal, ModalSizes, ModalVariants } from '@/ui/Modal';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';

type Props = {
  visible: boolean;
  onConfirm: (publishLaterDate: Date) => void;
  onClose: () => void;
};

const PublishLaterModal = ({ visible, onConfirm, onClose }: Props) => {
  const { t } = useTranslation();
  const [publishLaterDate, setPublishLaterDate] = useState(new Date());

  const handleChangeDate = (date: Date) => {
    setPublishLaterDate(date);
  };

  const handleConfirm = () => onConfirm(publishLaterDate);

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
          onChange={handleChangeDate}
          maxWidth="16rem"
        />
      </Stack>
    </Modal>
  );
};

export { PublishLaterModal };
