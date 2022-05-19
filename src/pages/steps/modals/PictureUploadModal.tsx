import { yupResolver } from '@hookform/resolvers/yup';
import type { DragEvent, FormEvent } from 'react';
import { forwardRef, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { useAutoFocus } from '@/hooks/useAutoFocus';
import { Button } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icon, Icons } from '@/ui/Icon';
import { Image } from '@/ui/Image';
import { Input } from '@/ui/Input';
import { Link } from '@/ui/Link';
import { Modal, ModalSizes, ModalVariants } from '@/ui/Modal';
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
  draggedImageFile?: FileList;
  imageToEdit?: { description: string; copyrightHolder: string };
  onSubmitValid: (data: FormData) => Promise<void>;
};

const MAX_FILE_SIZE = 5_000_000;
const ALLOWED_FILE_TYPES = ['png', 'jpg', 'jpeg', 'gif'];

const getValue = getValueFromTheme('pictureUploadBox');

type RegisterProps = {
  onChange: (event: FormEvent<HTMLInputElement>) => void;
  onBlur: (event: FormEvent<HTMLInputElement>) => void;
  name: string;
};

type DragAndDropProps = {
  onDrop: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
};

type Props = {
  error: any;
  image: any;
  marginBottom?: number;
} & RegisterProps &
  DragAndDropProps;

const PictureUploadBox = forwardRef<HTMLInputElement, Props>(
  (
    {
      error,
      image,
      marginBottom,
      children,
      onDrop,
      onDragOver,
      ...registerFileProps
    },
    ref,
  ) => {
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
        backgroundColor={getValue('backgroundColor')}
        justifyContent="center"
        alignItems="center"
        css={`
          border: 1px solid
            ${getValue(`${error ? 'errorBorderColor' : 'borderColor'}`)};
        `}
        padding={4}
        marginBottom={marginBottom}
        onDrop={onDrop}
        onDragOver={onDragOver}
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
            color={getValue('imageIconColor')}
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
            {t('pictures.upload_modal.actions.choose_file')}
          </Button>
          <Text variant={TextVariants.ERROR}>{error}</Text>
        </Stack>
        <Text variant={TextVariants.MUTED} textAlign="center">
          {t('pictures.upload_modal.file_requirements')}
        </Text>
      </Stack>
    );
  },
);

PictureUploadBox.displayName = 'PictureUploadBox';

const TermsAndConditionsLink = () => {
  const { t, i18n } = useTranslation();

  return (
    <Link
      href={`https://www.publiq.be/${i18n.language}/gebruikersovereenkomst-uitdatabank`}
      alt={t(
        'pictures.upload_modal.disclaimer.terms_and_conditions.labels.terms',
      )}
    >
      {t('pictures.upload_modal.disclaimer.terms_and_conditions.labels.terms')}
    </Link>
  );
};

const CopyrightLink = () => {
  const { t } = useTranslation();

  return (
    <Link
      href="/copyright"
      alt={t(
        'pictures.upload_modal.disclaimer.terms_and_conditions.labels.copyright',
      )}
    >
      {t(
        'pictures.upload_modal.disclaimer.terms_and_conditions.labels.copyright',
      )}
    </Link>
  );
};

const PictureUploadModal = ({
  visible,
  onClose,
  draggedImageFile,
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
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [reference] = useAutoFocus({ retriggerOn: visible });

  const watchedFile = watch('file');
  const image = watchedFile?.[0];

  useEffect(() => {
    const resetData = imageToEdit ?? {
      description: '',
      copyrightHolder: '',
    };
    reset(resetData);
  }, [imageToEdit, reset, visible]);

  useEffect(() => {
    setValue('file', draggedImageFile);
  }, [draggedImageFile, setValue]);

  const handleInternalOnDrop = (e: DragEvent<HTMLElement>) => {
    if (!e) return;

    e.preventDefault();

    const files = e.dataTransfer.files;

    if (files.length === 0) return;

    setValue('file', files);
  };

  const registerDescriptionProps = register('description');

  return (
    <Modal
      title={t('pictures.upload_modal.title')}
      visible={visible}
      variant={ModalVariants.QUESTION}
      onClose={onClose}
      confirmTitle={
        imageToEdit
          ? t('pictures.upload_modal.actions.adjust')
          : t('pictures.upload_modal.actions.upload')
      }
      cancelTitle={t('pictures.upload_modal.actions.cancel')}
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
              errors?.file &&
              t(
                `pictures.upload_modal.validation_messages.file.${errors.file.type}`,
              )
            }
            onDrop={handleInternalOnDrop}
            onDragOver={(e) => e.preventDefault()}
            {...register('file')}
          />
        )}
        <FormElement
          id="description"
          label="Beschrijving"
          info="Maximum 250 karakters"
          error={
            errors?.description &&
            t(
              `pictures.upload_modal.validation_messages.description.${errors.description.type}`,
            )
          }
          Component={
            <Input
              {...registerDescriptionProps}
              ref={(element: HTMLInputElement) => {
                registerDescriptionProps.ref(element);
                reference.current = element;
              }}
            />
          }
        />
        <FormElement
          id="copyrightHolder"
          label="Copyright"
          info={t('pictures.upload_modal.disclaimer.copyright')}
          error={
            errors?.copyrightHolder &&
            t(
              `pictures.upload_modal.validation_messages.copyrightHolder.${errors.copyrightHolder.type}`,
            )
          }
          Component={<Input {...register('copyrightHolder')} />}
        />

        <Text variant={TextVariants.MUTED} fontSize="0.8rem">
          <Trans i18nKey="pictures.upload_modal.disclaimer.terms_and_conditions.text">
            <TermsAndConditionsLink />
            <CopyrightLink />
          </Trans>
        </Text>
        <Button type="submit" display="none" />
      </Stack>
    </Modal>
  );
};

export { MAX_FILE_SIZE, PictureUploadModal };
export type { FormData };
