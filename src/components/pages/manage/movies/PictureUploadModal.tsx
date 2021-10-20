import { yupResolver } from '@hookform/resolvers/yup';
import type { FormEvent } from 'react';
import { forwardRef, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Button } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { Image } from '@/ui/Image';
import { Input } from '@/ui/Input';
import { InputWithLabel } from '@/ui/InputWithLabel';
import { Link } from '@/ui/Link';
import { Modal, ModalSizes, ModalVariants } from '@/ui/Modal';
import { Paragraph } from '@/ui/Paragraph';
import { Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

type FormData = {
  description: string;
  copyrightHolder: string;
  file: FileList;
};

type PictureUploadModalProps = {
  visible: boolean;
  onClose: () => void;
  imageToEdit?: { description: string; copyrightHolder: string };
  onSubmitValid: (data: FormData) => Promise<void>;
};

const MAX_FILE_SIZE = 5000000;
const ALLOWED_FILE_TYPES = ['png', 'jpg', 'jpeg', 'gif'];

const getValue = getValueFromTheme('moviesCreatePage');

type RegisterProps = {
  onChange: (event: FormEvent<HTMLInputElement>) => void;
  onBlur: (event: FormEvent<HTMLInputElement>) => void;
  name: string;
};

type Props = {
  error: any;
  image: any;
  marginBottom?: number;
} & RegisterProps;

// eslint-disable-next-line react/display-name
const PictureUploadBox = forwardRef<HTMLInputElement, Props>(
  ({ error, image, marginBottom, children, ...registerFileProps }, ref) => {
    const handleClickUpload = () => {
      document.getElementById('file').click();
    };

    const { t } = useTranslation();

    const imagePreviewUrl = image && URL.createObjectURL(image);

    return (
      <Stack
        flex={1}
        spacing={4}
        height={300}
        backgroundColor={getValue('pictureUploadBox.backgroundColor')}
        justifyContent="center"
        alignItems="center"
        css={`
          border: 1px solid
            ${getValue(
              `pictureUploadBox.${error ? 'errorBorderColor' : 'borderColor'}`,
            )};
        `}
        padding={4}
        marginBottom={marginBottom}
      >
        <Text fontWeight={700}>Selecteer je foto</Text>
        {imagePreviewUrl ? (
          <Stack spacing={2}>
            <Image
              src={imagePreviewUrl}
              alt="preview"
              width="auto"
              maxHeight="8rem"
              objectFit="cover"
            />
            <Text>{image.name}</Text>
          </Stack>
        ) : (
          <Icon
            name={Icons.IMAGE}
            width="auto"
            height="8rem"
            color={getValue('pictureUploadBox.imageIconColor')}
          />
        )}
        <Stack spacing={3} alignItems="center">
          <Text>Sleep een bestand hierheen of</Text>
          <Input
            id="file"
            type="file"
            display="none"
            accept={ALLOWED_FILE_TYPES.map((file) => `.${file}`).join(',')}
            ref={ref}
            {...registerFileProps}
          />
          <Button onClick={handleClickUpload}>
            {t('movies.create.picture.upload_modal.actions.choose_file')}
          </Button>
          <Text variant={TextVariants.ERROR}>{error}</Text>
        </Stack>
        <Text variant={TextVariants.MUTED} textAlign="center">
          {t('movies.create.picture.upload_modal.file_requirements')}
        </Text>
      </Stack>
    );
  },
);

const TermsAndConditionsLink = () => {
  const { t, i18n } = useTranslation();

  return (
    <Link
      href={`https://www.publiq.be/${i18n.language}/gebruikersovereenkomst-uitdatabank`}
      alt={t(
        'movies.create.picture.upload_modal.disclaimer.terms_and_conditions.labels.terms',
      )}
    >
      {t(
        'movies.create.picture.upload_modal.disclaimer.terms_and_conditions.labels.terms',
      )}
    </Link>
  );
};

const CopyrightLink = () => {
  const { t } = useTranslation();

  return (
    <Link
      href="/copyright"
      alt={t(
        'movies.create.picture.upload_modal.disclaimer.terms_and_conditions.labels.copyright',
      )}
    >
      {t(
        'movies.create.picture.upload_modal.disclaimer.terms_and_conditions.labels.copyright',
      )}
    </Link>
  );
};

const PictureUploadModal = ({
  visible,
  onClose,
  imageToEdit,
  onSubmitValid,
}: PictureUploadModalProps) => {
  const { t } = useTranslation();
  const formComponent = useRef<HTMLFormElement>();

  const schema = yup
    .object()
    .shape({
      description: yup.string().required().max(250),
      copyrightHolder: yup.string().required(),
      ...(!imageToEdit && {
        file: yup
          .mixed()
          .test('type', (fileList: FileList) => {
            const fileType = fileList?.[0]?.type.split('/').pop();
            return ALLOWED_FILE_TYPES.includes(fileType);
          })
          .test('size', (fileList: FileList) => {
            return fileList?.[0]?.size < MAX_FILE_SIZE;
          })
          .required(),
      }),
    })
    .required();

  const {
    watch,
    reset,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const watchedFile = watch('file');
  const image = watchedFile?.[0];

  useEffect(() => {
    reset(imageToEdit ?? {});
  }, [imageToEdit, reset, visible]);

  return (
    <Modal
      title={t('movies.create.picture.upload_modal.title')}
      visible={visible}
      variant={ModalVariants.QUESTION}
      onClose={onClose}
      confirmTitle={
        imageToEdit
          ? t('movies.create.picture.upload_modal.actions.adjust')
          : t('movies.create.picture.upload_modal.actions.upload')
      }
      cancelTitle={t('movies.create.picture.upload_modal.actions.cancel')}
      size={ModalSizes.MD}
      onConfirm={() => {
        formComponent.current.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true }),
        );
      }}
      confirmButtonDisabled={Object.keys(errors).length > 0}
    >
      <Stack
        as="form"
        ref={formComponent}
        spacing={4}
        padding={4}
        onSubmit={handleSubmit(async (data) => {
          await onSubmitValid(data);
          reset({});
        })}
      >
        {!imageToEdit && (
          <PictureUploadBox
            image={image}
            error={
              errors.file &&
              t(
                `movies.create.picture.upload_modal.validation_messages.file.${errors.file.type}`,
              )
            }
            {...register('file')}
          />
        )}
        <InputWithLabel
          id="description"
          label="Beschrijving"
          info="Maximum 250 karakters"
          required
          error={
            errors.description &&
            t(
              `movies.create.picture.upload_modal.validation_messages.description.${errors.description.type}`,
            )
          }
          {...register('description')}
        />

        <InputWithLabel
          id="copyrightHolder"
          label="Copyright"
          required
          info={
            <Stack spacing={3}>
              <Paragraph>
                {t('movies.create.picture.upload_modal.disclaimer.copyright')}
              </Paragraph>
              <Paragraph>
                <Trans i18nKey="movies.create.picture.upload_modal.disclaimer.terms_and_conditions.text">
                  <TermsAndConditionsLink />
                  <CopyrightLink />
                </Trans>
              </Paragraph>
            </Stack>
          }
          error={
            errors.copyrightHolder &&
            t(
              `movies.create.picture.upload_modal.validation_messages.copyrightHolder.${errors.copyrightHolder.type}`,
            )
          }
          {...register('copyrightHolder')}
        />
        <Text>
          <Text color="red">*</Text>{' '}
          {t(`movies.create.picture.upload_modal.required_field`)}
        </Text>
        <Button type="submit" display="none" />
      </Stack>
    </Modal>
  );
};

export { MAX_FILE_SIZE, PictureUploadModal };
export type { FormData };
