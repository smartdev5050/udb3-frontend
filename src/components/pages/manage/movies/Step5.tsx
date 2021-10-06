import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { useAddImageToEvent, useGetEventById } from '@/hooks/api/events';
import { useAddImage, useGetImageById } from '@/hooks/api/images';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { Image } from '@/ui/Image';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { InputWithLabel } from '@/ui/InputWithLabel';
import { Modal, ModalSizes, ModalVariants } from '@/ui/Modal';
import { Paragraph } from '@/ui/Paragraph';
import type { StackProps } from '@/ui/Stack';
import { Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { TextAreaWithLabel } from '@/ui/TextAreaWithLabel';
import { getValueFromTheme } from '@/ui/theme';
import { parseOfferId } from '@/utils/parseOfferId';

import type { MachineProps } from './create';
import { Step } from './Step';

const getValue = getValueFromTheme('moviesCreatePage');

type Step5Props = StackProps & MachineProps;

type FormData = {
  description: string;
  copyrightHolder: string;
  file: any;
};

type PictureUploadModalProps = {
  visible: boolean;
  onClose: () => void;
  imageId?: string;
  eventId: string;
};

const PictureUploadModal = ({
  visible,
  onClose,
  imageId,
  eventId,
}: PictureUploadModalProps) => {
  const { t, i18n } = useTranslation();
  const formComponent = useRef<HTMLFormElement>();

  // fetch data for imageId
  const getImageByIdQuery = useGetImageById({
    id: imageId,
  });

  const addImageMutation = useAddImage();

  const addImageToEventMutation = useAddImageToEvent();

  const schema = yup
    .object()
    .shape({
      description: yup.string().required().max(250),
      copyrightHolder: yup.string().required(),
      ...(imageId && { file: yup.mixed().required() }),
    })
    .required();

  const {
    reset,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // @ts-expect-error
    const { description, copyrightHolder } = getImageByIdQuery.data ?? {};
    reset({ description, copyrightHolder });
    // @ts-expect-error
  }, [getImageByIdQuery.data, reset, visible]);

  const handleSuccessAddImage = ({ imageId }) => addImageToEventMutation.mutate({ eventId, imageId });

  const handleOnSubmitValid = (data: FormData) => {
    addImageMutation.mutate(
      {
        ...data,
        file: data.file.item(0),
        language: i18n.language,
      },
      {
        onSuccess: handleSuccessAddImage
      },
    );
  };

  const handleOnSubmitInValid = (data) => {
    console.log('INVALID', data)
  }

  const handleClickUpload = () => {
    document.getElementById('file').click();
  };

  return (
    <Modal
      title={t('movies.create.modal.title')}
      visible={visible}
      variant={ModalVariants.QUESTION}
      onClose={onClose}
      confirmTitle={imageId ? 'Aanpassen' : 'Uploaden'}
      cancelTitle="Annuleren"
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
        onSubmit={handleSubmit(handleOnSubmitValid, handleOnSubmitInValid)}
      >
        {!imageId && (
          <Stack
            flex={1}
            spacing={4}
            height={300}
            backgroundColor={getValue('pictureUploadBox.backgroundColor')}
            justifyContent="center"
            alignItems="center"
            css={`
              border: 1px solid ${getValue('pictureUploadBox.borderColor')};
            `}
            padding={4}
          >
            <Text fontWeight={700}>Selecteer je foto</Text>
            <Icon
              name={Icons.IMAGE}
              width="4rem"
              height="4rem"
              color={getValue('pictureUploadBox.imageIconColor')}
            />
            <Stack spacing={2} alignItems="center">
              <Text>Sleep een bestand hierheen of</Text>
              <Input
                id="file"
                type="file"
                display="none"
                accept=".jpg,.jpeg,.gif,.png"
                {...register('file')}
              />
              <Button onClick={handleClickUpload}>Kies bestand</Button>
              <Text>{errors.file ? errors.file : ''}</Text>
            </Stack>
            <Text variant={TextVariants.MUTED} textAlign="center">
              De maximale grootte van je afbeelding is 5MB en heeft als type
              .jpeg, .gif of .png
            </Text>
          </Stack>
        )}
        <InputWithLabel
          id="description"
          label="Beschrijving"
          info="Maximum 250 karakters"
          required
          error={
            errors.description &&
            t(
              `movies.create.modal.validation_messages.description.${errors.description.type}`,
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
                Vermeld de naam van de rechtenhoudende fotograaf. Vul alleen de
                naam van je eigen vereniging of organisatie in als je zelf de
                rechten bezit (minimum 2 karakters).
              </Paragraph>
              <Paragraph>
                Je staat op het punt (een) afbeelding(en) toe te voegen en
                openbaar te verspreiden. Je dient daartoe alle geldende auteurs-
                en portretrechten te respecteren, alsook alle andere
                toepasselijke wetgeving. Je kan daarvoor aansprakelijk worden
                gehouden, zoals vastgelegd in de algemene voorwaarden. Meer
                informatie over copyright
              </Paragraph>
            </Stack>
          }
          error={
            errors.copyrightHolder &&
            t(
              `movies.create.modal.validation_messages.copyrightHolder.${errors.copyrightHolder.type}`,
            )
          }
          {...register('copyrightHolder')}
        />
        <Text>
          <Text color="red">*</Text> verplicht veld
        </Text>
      </Stack>
    </Modal>
  );
};

const Step5 = ({ movieState, sendMovieEvent, ...props }: Step5Props) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageToEditId, setImageToEditId] = useState('');

  const handleClickAddImage = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  const handleClickEditImage = (id: string) => {
    setImageToEditId(id);
    setIsModalVisible(true);
  };
  const handleDeleteImage = () => {};

  const eventId = '1633a062-349e-482e-9d88-cde754c45f71';

  // @ts-expect-error
  const getEventByIdQuery = useGetEventById({ id: eventId });

  // @ts-expect-error
  const images = useMemo(() => getEventByIdQuery.data?.mediaObject ?? [], [
    // @ts-expect-error
    getEventByIdQuery.data,
  ]);

  return (
    <Step stepNumber={5}>
      <PictureUploadModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        imageId={imageToEditId}
        eventId={eventId}
      />
      <Inline spacing={6}>
        <Stack spacing={3} flex={1}>
          <TextAreaWithLabel
            label={t('movies.create.actions.description')}
            value=""
            onInput={() => {}}
            rows={10}
          />
          <Button variant={ButtonVariants.LINK}>leegmaken</Button>
        </Stack>
        <Stack
          flex={1}
          spacing={3}
          height={300}
          backgroundColor={getValue('pictureUploadBox.backgroundColor')}
          justifyContent="center"
          css={`
            border: 1px solid ${getValue('pictureUploadBox.borderColor')};
          `}
          {...props}
        >
          {images.map((image) => (
            <Inline key={image.description} alignItems="center" spacing={3}>
              <Image
                src={image.thumbnailUrl}
                alt={image.description}
                width={200}
              />
              <Stack spacing={3}>
                <Button
                  variant={ButtonVariants.PRIMARY}
                  iconName={Icons.PENCIL}
                  spacing={3}
                  onClick={() =>
                    handleClickEditImage(parseOfferId(image['@id']))
                  }
                >
                  Wijzigen
                </Button>
                <Button
                  variant={ButtonVariants.DANGER}
                  iconName={Icons.TRASH}
                  spacing={3}
                  onClick={handleDeleteImage}
                >
                  Verwijderen
                </Button>
              </Stack>
            </Inline>
          ))}
          <Stack alignItems="center">
            <Text variant={TextVariants.MUTED}>
              Voeg een afbeelding toe zodat bezoekers je activiteit beter
              herkennen
            </Text>
            <Button
              variant={ButtonVariants.SECONDARY}
              onClick={handleClickAddImage}
            >
              Afbeelding toevoegen
            </Button>
          </Stack>
        </Stack>
      </Inline>
    </Step>
  );
};

export { Step5 };
