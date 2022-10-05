import { useTranslation } from 'react-i18next';

import { Modal, ModalSizes, ModalVariants } from '@/ui/Modal';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const PlaceAddModal = ({ visible, onClose }: Props) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    console.log('handle confirm');
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      title={t('organizer.add_modal.title')}
      confirmTitle={t('organizer.add_modal.actions.add')}
      cancelTitle={t('organizer.add_modal.actions.cancel')}
      visible={visible}
      variant={ModalVariants.QUESTION}
      onConfirm={handleConfirm}
      onClose={handleClose}
      size={ModalSizes.LG}
    >
      <Stack>
        <Text>Location Add Modal</Text>
      </Stack>
    </Modal>
  );
};

export { PlaceAddModal };
