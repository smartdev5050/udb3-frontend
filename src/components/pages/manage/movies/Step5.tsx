import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

import {
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
import { DeleteModal } from './DeleteModal';
import type { FormData } from './PictureUploadModal';
import { PictureUploadModal } from './PictureUploadModal';
import { Step } from './Step';

const getValue = getValueFromTheme('moviesCreatePage');

type Step5Props = StackProps & MachineProps;

const Step5 = ({ movieState, sendMovieEvent, ...props }: Step5Props) => {
  const eventId = '1633a062-349e-482e-9d88-cde754c45f71';

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

  // @ts-expect-error
  const images = useMemo(() => getEventByIdQuery.data?.mediaObject ?? [], [
    // @ts-expect-error
    getEventByIdQuery.data,
  ]);

  const imageToEdit = useMemo(() => {
    const image = images.find(
      (image) => parseOfferId(image['@id']) === imageToEditId,
    );

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

  const handleConfirmDelete = (imageId: string) => {
    deleteImageFromEventMutation.mutate({ eventId, imageId });
    setIsPictureDeleteModalVisible(false);
  };

  const handleSubmitValid = ({
    file,
    description,
    copyrightHolder,
  }: FormData) => {
    if (imageToEdit) {
      updateImageFromEventMutation.mutate({
        eventId,
        imageId: parseOfferId(imageToEdit['@id']),
        description,
        copyrightHolder,
      });

      return;
    }

    addImageMutation.mutate({
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
      <DeleteModal
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
                  onClick={() =>
                    handleClickDeleteImage(parseOfferId(image['@id']))
                  }
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
