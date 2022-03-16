import { useTranslation } from 'react-i18next';

import { Box } from '@/ui/Box';
import { Modal, ModalVariants } from '@/ui/Modal';

type Props = {
  visible: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const PictureDeleteModal = ({ visible, onConfirm, onClose }: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      variant={ModalVariants.QUESTION}
      visible={visible}
      onConfirm={onConfirm}
      onClose={onClose}
      title={t('movies.create.picture.delete_modal.title')}
      confirmTitle={t('movies.create.picture.delete_modal.actions.confirm')}
      cancelTitle={t('movies.create.picture.delete_modal.actions.cancel')}
    >
      <Box padding={4}>
        {t('movies.create.picture.delete_modal.description')}
      </Box>
    </Modal>
  );
};

export { PictureDeleteModal };
