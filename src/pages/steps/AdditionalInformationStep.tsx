import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

import {
  useAddEventMainImageMutation,
  useAddImageToEventMutation,
  useAddPriceInfoMutation,
  useAddVideoToEventMutation,
  useChangeDescriptionMutation,
  useDeleteImageFromEventMutation,
  useDeleteVideoFromEventMutation,
  useGetEventByIdQuery,
  useUpdateImageFromEventMutation,
} from '@/hooks/api/events';
import { useAddImageMutation } from '@/hooks/api/images';
import { PictureDeleteModal } from '@/pages/steps/modals/PictureDeleteModal';
import type { FormData } from '@/pages/steps/modals/PictureUploadModal';
import { PictureUploadModal } from '@/pages/steps/modals/PictureUploadModal';
import type {
  FormData as PriceInfoFormData,
  Rate,
} from '@/pages/steps/modals/PriceInfoModal';
import { PriceInfoModal } from '@/pages/steps/modals/PriceInfoModal';
import type { Values } from '@/types/Values';
import { Alert } from '@/ui/Alert';
import { Box, parseSpacing } from '@/ui/Box';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Label } from '@/ui/Label';
import { ProgressBar, ProgressBarVariants } from '@/ui/ProgressBar';
import type { StackProps } from '@/ui/Stack';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { TextArea } from '@/ui/TextArea';
import { getValueFromTheme } from '@/ui/theme';
import { parseOfferId } from '@/utils/parseOfferId';

import type { ImageType } from '../PictureUploadBox';
import { PictureUploadBox } from '../PictureUploadBox';
import { VideoLinkAddModal } from '../VideoLinkAddModal';
import { VideoLinkDeleteModal } from '../VideoLinkDeleteModal';
import type { Video, VideoEnriched } from '../VideoUploadBox';
import { VideoUploadBox } from '../VideoUploadBox';
import { PriceInformation } from './PriceInformation';

const IDEAL_DESCRIPTION_LENGTH = 200;

const AdditionalInformationStepVariant = {
  MINIMAL: 'minimal',
  EXTENDED: 'extended',
} as const;

type Field = 'description' | 'image' | 'video';

type Props = StackProps & {
  eventId: string;
  onSuccess: (field: Field) => void;
  variant?: Values<typeof AdditionalInformationStepVariant>;
};

const AdditionalInformationStep = ({
  eventId,
  onSuccess,
  variant,
  ...props
}: Props) => {
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
  const [isVideoLinkAddModalVisible, setIsVideoLinkAddModalVisible] = useState(
    false,
  );
  const [
    isVideoLinkDeleteModalVisible,
    setIsVideoLinkDeleteModalVisible,
  ] = useState(false);

  const [isPriceInfoModalVisible, setIsPriceInfoModalVisible] = useState(false);

  const [description, setDescription] = useState('');
  const [imageToEditId, setImageToEditId] = useState('');
  const [imageToDeleteId, setImageToDeleteId] = useState('');
  const [videoToDeleteId, setVideoToDeleteId] = useState('');

  const [videos, setVideos] = useState([]);

  const getEventByIdQuery = useGetEventByIdQuery({ id: eventId });

  const addImageToEventMutation = useAddImageToEventMutation({
    onSuccess: async () => {
      setIsPictureUploadModalVisible(false);
      await invalidateEventQuery('image');
    },
  });

  const handleSuccessAddImage = ({ imageId }) => {
    return addImageToEventMutation.mutate({ eventId, imageId });
  };

  const addImageMutation = useAddImageMutation({
    onSuccess: handleSuccessAddImage,
  });

  const addEventMainImageMutation = useAddEventMainImageMutation({
    onSuccess: async () => {
      await invalidateEventQuery('image');
    },
  });

  const updateImageFromEventMutation = useUpdateImageFromEventMutation({
    onSuccess: async () => {
      setIsPictureUploadModalVisible(false);
      await invalidateEventQuery('image');
    },
  });

  const deleteImageFromEventMutation = useDeleteImageFromEventMutation({
    onSuccess: async () => {
      setIsPictureUploadModalVisible(false);
      await invalidateEventQuery('image');
    },
  });

  const addVideoToEventMutation = useAddVideoToEventMutation({
    onSuccess: async () => {
      setIsVideoLinkDeleteModalVisible(false);
      await invalidateEventQuery('video');
    },
  });

  const deleteVideoFromEventMutation = useDeleteVideoFromEventMutation({
    onSuccess: async () => {
      setIsVideoLinkDeleteModalVisible(false);
      await invalidateEventQuery('video');
    },
  });

  useEffect(() => {
    // @ts-expect-error
    if (!getEventByIdQuery.data?.description) return;
    // @ts-expect-error
    setDescription(getEventByIdQuery.data.description.nl);
    // @ts-expect-error
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEventByIdQuery.data?.description]);

  useEffect(() => {
    if (variant !== AdditionalInformationStepVariant.EXTENDED) {
      return;
    }

    if (
      // @ts-expect-error
      !getEventByIdQuery.data?.videos ||
      // @ts-expect-error
      getEventByIdQuery.data.videos.length === 0
    ) {
      setVideos([]);
      return;
    }

    // @ts-expect-error
    enrichVideos(getEventByIdQuery.data.videos as Video[]);
  }, [
    // @ts-expect-error
    getEventByIdQuery.data?.videos,
    variant,
  ]);

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
    ] as ImageType[];
  }, [
    // @ts-expect-error
    getEventByIdQuery.data,
  ]);

  const priceInfo = useMemo(() => {
    // @ts-expect-error
    const priceInfo = getEventByIdQuery.data?.priceInfo ?? [];
    // @ts-expect-error
    const mainLanguage = getEventByIdQuery.data?.mainLanguage;

    return priceInfo.map((rate: any) => {
      return {
        ...rate,
        name: {
          ...rate.name,
          [i18n.language]: rate.name[i18n.language] ?? rate.name[mainLanguage],
        },
        price: rate.price.toFixed(2).replace('.', ','),
      };
    });
  }, [
    // @ts-expect-error
    getEventByIdQuery.data?.priceInfo,
    // @ts-expect-error
    getEventByIdQuery.data?.mainLanguage,
    i18n.language,
  ]);

  const enrichVideos = async (video: Video[]) => {
    const getYoutubeThumbnailUrl = (videoUrl: string) => {
      return `https://i.ytimg.com/vi_webp/${
        videoUrl.split('v=')[1]
      }/maxresdefault.webp`;
    };

    const getVimeoThumbnailUrl = async (videoUrl: string) => {
      const urlParts = videoUrl.split('/');
      const videoId = videoUrl.endsWith('/')
        ? urlParts[urlParts.length - 2]
        : urlParts[urlParts.length - 1];

      const response = await fetch(
        `http://vimeo.com/api/v2/video/${videoId}.json`,
      );

      const data = await response.json();

      return data?.[0]?.thumbnail_small;
    };

    const convertAllVideoUrlsPromises = video.map(async ({ url, ...video }) => {
      const thumbnailUrl = url.includes('youtube')
        ? getYoutubeThumbnailUrl(url)
        : await getVimeoThumbnailUrl(url);

      const enrichedVideo: VideoEnriched = {
        ...video,
        url,
        thumbnailUrl,
      };

      return enrichedVideo;
    });

    const data = await Promise.all(convertAllVideoUrlsPromises);

    setVideos(data);
  };

  const eventTypeId = useMemo(() => {
    // @ts-expect-error
    return getEventByIdQuery.data?.terms?.find(
      (term) => term.domain === 'eventtype',
    )?.id;
  }, [
    // @ts-expect-error
    getEventByIdQuery.data,
  ]);

  const descriptionProgress = useMemo(() => {
    return (description.length / IDEAL_DESCRIPTION_LENGTH) * 100;
  }, [description]);

  const imageToEdit = useMemo(() => {
    const image = images.find((image) => image.parsedId === imageToEditId);

    if (!image) return null;

    const { file, ...imageWithoutFile } = image;

    return imageWithoutFile;
  }, [images, imageToEditId]);

  const invalidateEventQuery = async (field: Field) => {
    await queryClient.invalidateQueries(['events', { id: eventId }]);
    onSuccess(field);
  };

  const changeDescriptionMutation = useChangeDescriptionMutation({
    onSuccess: async () => {
      await invalidateEventQuery('description');
    },
  });

  const handleClickAddImage = () => {
    setImageToEditId(undefined);
    setIsPictureUploadModalVisible(true);
  };

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

  const handleConfirmDeleteImage = (imageId: string) => {
    deleteImageFromEventMutation.mutate({ eventId, imageId });
    setIsPictureDeleteModalVisible(false);
  };

  const handleAddVideoLink = (url: string) => {
    addVideoToEventMutation.mutate({
      eventId,
      url,
      language: i18n.language,
    });
    setIsVideoLinkAddModalVisible(false);
  };

  const handleDeleteVideoLink = (videoId: string) => {
    setVideoToDeleteId(videoId);
    setIsVideoLinkDeleteModalVisible(true);
  };

  const handleConfirmDeleteVideo = (videoId: string) => {
    deleteVideoFromEventMutation.mutate({ eventId, videoId });
    setIsVideoLinkDeleteModalVisible(false);
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

  const addPriceInfoMutation = useAddPriceInfoMutation({
    onSuccess: () => setIsPriceInfoModalVisible(false),
  });

  const handlePriceInfoSubmitValid = async ({ rates }: PriceInfoFormData) => {
    const convertedPriceInfo = rates.map((rate: Rate) => {
      return {
        ...rate,
        price: parseFloat(rate.price.replace(',', '.')),
      };
    });

    await addPriceInfoMutation.mutateAsync({
      eventId,
      priceInfo: convertedPriceInfo,
    });
  };

  const handleBlurDescription = () => {
    if (!description) return;

    changeDescriptionMutation.mutate({
      description,
      language: i18n.language,
      eventId,
    });
  };

  const handleClickClearDescription = () => {
    setDescription('');
    changeDescriptionMutation.mutate({
      description: '',
      language: i18n.language,
      eventId,
    });
  };

  const DescriptionInfo = (props: StackProps) => (
    <Stack spacing={3} {...getStackProps(props)}>
      {description.length < IDEAL_DESCRIPTION_LENGTH && (
        <ProgressBar
          variant={ProgressBarVariants.SUCCESS}
          progress={descriptionProgress}
        />
      )}
      <Text variant={TextVariants.MUTED}>
        {description.length < IDEAL_DESCRIPTION_LENGTH
          ? t(
              'create.additionalInformation.description.progress_info.not_complete',
              {
                idealLength: IDEAL_DESCRIPTION_LENGTH,
                count: IDEAL_DESCRIPTION_LENGTH - description.length,
              },
            )
          : t(
              'create.additionalInformation.description.progress_info.complete',
              {
                idealLength: IDEAL_DESCRIPTION_LENGTH,
              },
            )}
      </Text>
      <Button
        variant={ButtonVariants.LINK}
        onClick={handleClickClearDescription}
      >
        {t('create.additionalInformation.description.clear')}
      </Button>
      {eventTypeId && (
        <Alert>
          <Box
            forwardedAs="div"
            dangerouslySetInnerHTML={{
              __html: t(
                `create*additionalInformation*description*tips*${eventTypeId}`,
                {
                  keySeparator: '*',
                },
              ),
            }}
            css={`
              strong {
                font-weight: bold;
              }

              ul {
                list-style-type: disc;
                margin-bottom: ${parseSpacing(4)};

                li {
                  margin-left: ${parseSpacing(5)};
                }
              }
            `}
          />
        </Alert>
      )}
    </Stack>
  );

  return (
    <Stack {...getStackProps(props)}>
      <PictureUploadModal
        visible={isPictureUploadModalVisible}
        onClose={() => setIsPictureUploadModalVisible(false)}
        imageToEdit={imageToEdit}
        onSubmitValid={handleSubmitValid}
      />
      <PictureDeleteModal
        visible={isPictureDeleteModalVisible}
        onConfirm={() => handleConfirmDeleteImage(imageToDeleteId)}
        onClose={() => setIsPictureDeleteModalVisible(false)}
      />
      <PriceInfoModal
        visible={isPriceInfoModalVisible}
        onClose={() => setIsPriceInfoModalVisible(false)}
        onSubmitValid={handlePriceInfoSubmitValid}
        priceInfo={priceInfo}
      />
      <VideoLinkAddModal
        visible={isVideoLinkAddModalVisible}
        onConfirm={handleAddVideoLink}
        onClose={() => setIsVideoLinkAddModalVisible(false)}
      />
      <VideoLinkDeleteModal
        visible={isVideoLinkDeleteModalVisible}
        onConfirm={() => handleConfirmDeleteVideo(videoToDeleteId)}
        onClose={() => setIsVideoLinkDeleteModalVisible(false)}
      />
      <Inline
        spacing={6}
        alignItems={{ default: 'flex-start', m: 'normal' }}
        stackOn="m"
      >
        <Stack spacing={3} flex={1}>
          <FormElement
            id="create-description"
            label={t('create.additionalInformation.description.title')}
            Component={
              <TextArea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleBlurDescription}
              />
            }
            info={<DescriptionInfo />}
          />
          {variant === AdditionalInformationStepVariant.EXTENDED && (
            <PriceInformation
              priceInfo={priceInfo}
              onClickAddPriceInfo={() => setIsPriceInfoModalVisible(true)}
            />
          )}
        </Stack>
        <Stack spacing={4} flex={1}>
          <PictureUploadBox
            images={images}
            onClickEditImage={handleClickEditImage}
            onClickDeleteImage={handleClickDeleteImage}
            onClickSetMainImage={handleClickSetMainImage}
            onClickAddImage={handleClickAddImage}
          />
          {variant === AdditionalInformationStepVariant.EXTENDED && (
            <VideoUploadBox
              videos={videos}
              onClickAddVideo={() => setIsVideoLinkAddModalVisible(true)}
              onClickDeleteVideo={handleDeleteVideoLink}
            />
          )}
        </Stack>
      </Inline>
    </Stack>
  );
};

AdditionalInformationStep.defaultProps = {
  variant: AdditionalInformationStepVariant.EXTENDED,
};

export { AdditionalInformationStep, AdditionalInformationStepVariant };
