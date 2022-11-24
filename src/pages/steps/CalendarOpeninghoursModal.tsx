import { useTranslation } from 'react-i18next';

import { Modal, ModalSizes, ModalVariants } from '@/ui/Modal';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';

type CalendarOpeninghoursModalProps = {
  visible: boolean;
  onClose: () => void;
};

const CalendarOpeninghoursModal = ({
  visible,
  onClose,
}: CalendarOpeninghoursModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      title="Openingsuren"
      visible={visible}
      variant={ModalVariants.QUESTION}
      onClose={onClose}
      confirmTitle="Opslaan"
      cancelTitle="Annuleren"
      size={ModalSizes.MD}
      onConfirm={() => {
        console.log('on confirm');
      }}
    >
      <Stack spacing={4} padding={4}>
        <Text></Text>
      </Stack>
    </Modal>
  );
};

export { CalendarOpeninghoursModal };
