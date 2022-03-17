import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Alert, AlertVariants } from '@/ui/Alert';
import { FormElement } from '@/ui/FormElement';
import { Input } from '@/ui/Input';
import { Modal, ModalSizes, ModalVariants } from '@/ui/Modal';
import { Stack } from '@/ui/Stack';

type Props = {
  visible: boolean;
  onConfirm: (videoUrl: string) => void;
  onClose: () => void;
};

const ALLOWED_SOURCE_REGEX = /^http(s?):\/\/(www\.)?((youtube\.com\/watch\?v=([^\/#&?]*))|(vimeo\.com\/([^\/#&?]*))|(youtu\.be\/([^\/#&?]*)))/;

type FormData = {
  link: string;
};

const schema = yup
  .object()
  .shape({
    link: yup.string().matches(ALLOWED_SOURCE_REGEX).required(),
  })
  .required();

const AddVideoLinkModal = ({ visible, onConfirm, onClose }: Props) => {
  const { t } = useTranslation();

  const { register, handleSubmit, formState, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleConfirm = async () => {
    await handleSubmit((data) => {
      onConfirm(data.link);
    })();
    reset({ link: '' });
  };

  return (
    <Modal
      title={t('videos.upload_modal.title')}
      confirmTitle={t('videos.upload_modal.actions.add')}
      cancelTitle={t('videos.upload_modal.actions.cancel')}
      visible={visible}
      variant={ModalVariants.QUESTION}
      onConfirm={handleConfirm}
      onClose={onClose}
      size={ModalSizes.MD}
    >
      <Stack padding={4}>
        <FormElement
          Component={<Input {...register('link')} />}
          id="video-link"
          label="Link"
          info={
            <Alert variant={AlertVariants.WARNING}>
              {t('videos.upload_modal.link_requirements')}
            </Alert>
          }
          error={
            formState.errors.link &&
            t('videos.upload_modal.validation_messages.link')
          }
        />
      </Stack>
    </Modal>
  );
};

export { AddVideoLinkModal };
