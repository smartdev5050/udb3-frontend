import { useTranslation } from 'react-i18next';

import { Box } from '@/ui/Box';
import { Modal, ModalVariants } from '@/ui/Modal';

type Props = {
  visible: boolean;
  onConfirm: (videoId: string) => void;
  onClose: () => void;
};

const VideoLinkDeleteModal = ({ visible, onConfirm, onClose }: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      variant={ModalVariants.QUESTION}
      visible={visible}
      onConfirm={onConfirm}
      onClose={onClose}
      title={t('videos.delete_modal.title')}
      confirmTitle={t('videos.delete_modal.actions.confirm')}
      cancelTitle={t('videos.delete_modal.actions.cancel')}
    >
      <Box padding={4}>{t('videos.delete_modal.description')}</Box>
    </Modal>
  );
};

export { VideoLinkDeleteModal };
