import { useTranslation } from 'react-i18next';

import { Alert, AlertVariants } from '@/ui/Alert';
import { DatePicker } from '@/ui/DatePicker';
import { Modal, ModalSizes, ModalVariants } from '@/ui/Modal';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';

type Props = {
  visible: boolean;
  selectedDate: Date;
  onChangeDate: (value: Date) => void;
  onConfirm: () => void;
  onClose: () => void;
};

const PublishLaterModal = ({
  selectedDate,
  onChangeDate,
  visible,
  onConfirm,
  onClose,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      variant={ModalVariants.QUESTION}
      visible={visible}
      onConfirm={onConfirm}
      scrollable={false}
      onClose={onClose}
      title={t('create.publish_modal.title')}
      confirmTitle={t('create.publish_modal.actions.confirm')}
      cancelTitle={t('create.publish_modal.actions.cancel')}
      confirmButtonDisabled={!selectedDate}
      size={ModalSizes.MD}
    >
      <Stack padding={4} spacing={4} alignItems="flex-start">
        <Text>{t('create.publish_modal.description')}</Text>
        <Alert variant={AlertVariants.WARNING}>
          {t('create.publish_modal.warning')}
        </Alert>
        <DatePicker
          id="publish-later-date"
          selected={selectedDate}
          onChange={onChangeDate}
          maxWidth="16rem"
        />
      </Stack>
    </Modal>
  );
};

export { PublishLaterModal };
