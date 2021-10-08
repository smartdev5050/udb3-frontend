import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

import {
  useAddEventMainImage,
  useAddImageToEvent,
  useDeleteImageFromEvent,
  useGetEventById,
  useUpdateImageFromEvent,
} from '@/hooks/api/events';
import { useAddImage } from '@/hooks/api/images';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icons } from '@/ui/Icon';
import { Image } from '@/ui/Image';
import { Inline } from '@/ui/Inline';
import type { StackProps } from '@/ui/Stack';
import { Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { TextAreaWithLabel } from '@/ui/TextAreaWithLabel';
import { getValueFromTheme } from '@/ui/theme';
import { parseOfferId } from '@/utils/parseOfferId';

import type { MachineProps } from './create';
import { PictureDeleteModal } from './PictureDeleteModal';
import type { FormData } from './PictureUploadModal';
import { PictureUploadModal } from './PictureUploadModal';
import { Step } from './Step';

const getValue = getValueFromTheme('moviesCreatePage');

type Step5Props = StackProps & MachineProps;

const Step5 = ({ movieState, sendMovieEvent, ...props }: Step5Props) => {
  const eventId = '37d2edd9-ffb4-4abd-9f79-e21d9960d437';

  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const [
    isPictureUploadModalVisible,
    setIsPictureUploadModalVisible,
  ] = useState(false);
  const [
    isPictureDeleteModalVisible,
    setIsPictureDeleteModalVisible,
  ] = useState(false);

  const [imageToEditId, setImageToEditId] = useState('');
  const [imageToDeleteId, setImageToDeleteId] = useState('');

  // @ts-expect-error
  const getEventByIdQuery = useGetEventById({ id: eventId });

  const images = useMemo(() => {
    // @ts-expect-error
    const mediaObjects = getEventByIdQuery.data?.mediaObject ?? [];
    // @ts-expect-error
    const eventImage = getEventByIdQuery.data?.image;

    const parsedMediaObjects = mediaObjects.map((mediaObject) => ({
      parsedId: parseOfferId(mediaObject['@id']),
      isMain: mediaObject.contentUrl === eventImage,
      ...mediaObject,
    }));

    return [
      ...parsedMediaObjects.filter((mediaObject) => mediaObject.isMain),
      ...parsedMediaObjects.filter((mediaObject) => !mediaObject.isMain),
    ];
  }, [
    // @ts-expect-error
    getEventByIdQuery.data,
  ]);

  const imageToEdit = useMemo(() => {
    const image = images.find((image) => image.parsedId === imageToEditId);

    if (!image) return null;

    const { file, ...imageWithoutFile } = image;

    return imageWithoutFile;
  }, [images, imageToEditId]);

  const invalidateEventQuery = async () =>
    await queryClient.invalidateQueries(['events', { id: eventId }]);

  const handleSuccessAddImage = ({ imageId }) =>
    addImageToEventMutation.mutate({ eventId, imageId });

  const addImageMutation = useAddImage({
    onSuccess: handleSuccessAddImage,
  });

  const addImageToEventMutation = useAddImageToEvent({
    onSuccess: () => {
      setIsPictureUploadModalVisible(false);
      invalidateEventQuery();
    },
  });

  const addEventMainImageMutation = useAddEventMainImage({
    onSuccess: () => {
      invalidateEventQuery();
    },
  });

  const updateImageFromEventMutation = useUpdateImageFromEvent({
    onSuccess: () => {
      setIsPictureUploadModalVisible(false);
      invalidateEventQuery();
    },
  });

  const handleSuccessDeleteImage = invalidateEventQuery;

  const deleteImageFromEventMutation = useDeleteImageFromEvent({
    onSuccess: handleSuccessDeleteImage,
  });

  const handleClickAddImage = () => {
    setImageToEditId(undefined);
    setIsPictureUploadModalVisible(true);
  };
  const handleCloseModal = () => setIsPictureUploadModalVisible(false);

  const handleClickEditImage = (imageId: string) => {
    setImageToEditId(imageId);
    setIsPictureUploadModalVisible(true);
  };

  const handleClickDeleteImage = (imageId: string) => {
    setImageToDeleteId(imageId);
    setIsPictureDeleteModalVisible(true);
  };

  const handleClickSetMainImage = (imageId: string) =>
    addEventMainImageMutation.mutate({ eventId, imageId });

  const handleConfirmDelete = (imageId: string) => {
    deleteImageFromEventMutation.mutate({ eventId, imageId });
    setIsPictureDeleteModalVisible(false);
  };

  const handleSubmitValid = async ({
    file,
    description,
    copyrightHolder,
  }: FormData) => {
    if (imageToEdit) {
      await updateImageFromEventMutation.mutateAsync({
        eventId,
        imageId: imageToEdit.parsedId,
        description,
        copyrightHolder,
      });

      return;
    }

    await addImageMutation.mutateAsync({
      description,
      copyrightHolder,
      file: file?.[0],
      language: i18n.language,
    });
  };

  return (
    <Step stepNumber={5}>
      <PictureUploadModal
        visible={isPictureUploadModalVisible}
        onClose={handleCloseModal}
        imageToEdit={imageToEdit}
        onSubmitValid={handleSubmitValid}
      />
      <PictureDeleteModal
        visible={isPictureDeleteModalVisible}
        onConfirm={() => handleConfirmDelete(imageToDeleteId)}
        onClose={() => setIsPictureDeleteModalVisible(false)}
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
          spacing={4}
          padding={4}
          backgroundColor={getValue('pictureUploadBox.backgroundColor')}
          justifyContent="center"
          css={`
            border: 1px solid ${getValue('pictureUploadBox.borderColor')};
          `}
          {...props}
        >
          <Stack
            spacing={2}
            maxHeight={380}
            css={`
              overflow: auto;
            `}
          >
            {images.map((image, index, imagesArr) => {
              const thumbnailSize = 80;
              const isLastItem = index === imagesArr.length - 1;
              return (
                <Stack
                  key={image.parsedId}
                  spacing={4}
                  padding={4}
                  backgroundColor={
                    image.isMain
                      ? getValue('pictureUploadBox.mainImageBackgroundColor')
                      : 'none'
                  }
                  css={`
                    border-bottom: 1px solid
                      ${image.isMain
                        ? getValue('pictureUploadBox.mainImageBorderColor')
                        : `${
                            isLastItem
                              ? 'none'
                              : getValue('pictureUploadBox.imageBorderColor')
                          }`};
                  `}
                >
                  <Inline spacing={4} alignItems="center">
                    <Image
                      src={`${image.thumbnailUrl}?width=${thumbnailSize}&height=${thumbnailSize}`}
                      alt={image.description}
                      width={thumbnailSize}
                      height={thumbnailSize}
                      css={`
                        border: 1px solid
                          ${getValue('pictureUploadBox.thumbnailBorderColor')};
                      `}
                    />
                    <Stack spacing={2}>
                      <Text>{image.description}</Text>
                      <Text variant={TextVariants.MUTED}>
                        © {image.copyrightHolder}
                      </Text>
                    </Stack>
                  </Inline>
                  <Inline spacing={3}>
                    <Button
                      variant={ButtonVariants.PRIMARY}
                      iconName={Icons.PENCIL}
                      spacing={3}
                      onClick={() => handleClickEditImage(image.parsedId)}
                    >
                      Wijzigen
                    </Button>
                    <Button
                      variant={ButtonVariants.DANGER}
                      iconName={Icons.TRASH}
                      spacing={3}
                      onClick={() => handleClickDeleteImage(image.parsedId)}
                    >
                      Verwijderen
                    </Button>
                    {!image.isMain ? (
                      <Button
                        variant={ButtonVariants.SECONDARY}
                        onClick={() => handleClickSetMainImage(image.parsedId)}
                      >
                        Maak hoofdafbeelding
                      </Button>
                    ) : null}
                  </Inline>
                </Stack>
              );
            })}
          </Stack>
          <Stack alignItems="center" padding={4} spacing={3}>
            <Text variant={TextVariants.MUTED} textAlign="center">
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
