import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { OfferType, OfferTypes } from '@/constants/OfferType';
import { useGetEventByIdQuery } from '@/hooks/api/events';
import { useAddImageMutation } from '@/hooks/api/images';
import {
  useAddOfferImageMutation,
  useAddOfferMainImageMutation,
  useAddOfferVideoMutation,
  useDeleteOfferImageMutation,
  useDeleteOfferVideoMutation,
  useUpdateOfferImageMutation,
} from '@/hooks/api/offers';
import { useGetPlaceByIdQuery } from '@/hooks/api/places';
import type { FormData } from '@/pages/steps/modals/PictureUploadModal';
import { Inline } from '@/ui/Inline';
import { getStackProps, Stack } from '@/ui/Stack';
import { Breakpoints } from '@/ui/theme';
import { parseOfferId } from '@/utils/parseOfferId';

import type { ImageType } from '../../PictureUploadBox';
import { PictureUploadBox } from '../../PictureUploadBox';
import { VideoLinkAddModal } from '../../VideoLinkAddModal';
import { VideoLinkDeleteModal } from '../../VideoLinkDeleteModal';
import type { Video, VideoEnriched } from '../../VideoUploadBox';
import { VideoUploadBox } from '../../VideoUploadBox';
import { PictureDeleteModal } from '../modals/PictureDeleteModal';
import { PictureUploadModal } from '../modals/PictureUploadModal';

type Props = {
  scope: OfferType;
  offerId?: string;
  onSuccessfulChange: () => void;
  onChangeCompleted: (completed: boolean) => void;
};

const MediaStep = ({
  scope,
  offerId,
  onSuccessfulChange,
  onChangeCompleted,
  ...props
}: Props) => {
  const { i18n } = useTranslation();

  // TODO: refactor
  const eventId = offerId;

  const useGetOfferByIdQuery =
    scope === OfferTypes.EVENTS ? useGetEventByIdQuery : useGetPlaceByIdQuery;

  const getOfferByIdQuery = useGetOfferByIdQuery({ id: offerId });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeCompleted = useCallback(onChangeCompleted, []);

  const videosFromQuery = useMemo(
    // @ts-expect-error
    () => getOfferByIdQuery.data?.videos ?? [],
    [
      // @ts-expect-error
      getOfferByIdQuery.data?.videos,
    ],
  );

  const mediaObjects = useMemo(
    // @ts-expect-error
    () => getOfferByIdQuery.data?.mediaObject ?? [],
    // @ts-expect-error
    [getOfferByIdQuery.data?.mediaObject],
  );

  const eventImage = useMemo(
    // @ts-expect-error
    () => getOfferByIdQuery.data?.image ?? [],
    // @ts-expect-error
    [getOfferByIdQuery.data?.image],
  );

  const [isPictureUploadModalVisible, setIsPictureUploadModalVisible] =
    useState(false);
  const [isPictureDeleteModalVisible, setIsPictureDeleteModalVisible] =
    useState(false);
  const [isVideoLinkAddModalVisible, setIsVideoLinkAddModalVisible] =
    useState(false);
  const [isVideoLinkDeleteModalVisible, setIsVideoLinkDeleteModalVisible] =
    useState(false);

  const [imageToEditId, setImageToEditId] = useState('');
  const [draggedImageFile, setDraggedImageFile] = useState<FileList>();
  const [imageToDeleteId, setImageToDeleteId] = useState('');
  const [videoToDeleteId, setVideoToDeleteId] = useState('');

  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState<ImageType[]>([]);

  const addImageToEventMutation = useAddOfferImageMutation({
    onSuccess: async () => {
      setIsPictureUploadModalVisible(false);
      onSuccessfulChange();
    },
  });

  const handleSuccessAddImage = ({ imageId }) => {
    return addImageToEventMutation.mutate({ eventId, imageId, scope });
  };

  const addImageMutation = useAddImageMutation({
    onSuccess: handleSuccessAddImage,
  });

  const addOfferMainImageMutation = useAddOfferMainImageMutation({
    onSuccess: onSuccessfulChange,
  });

  const updateOfferImageMutation = useUpdateOfferImageMutation({
    onSuccess: async () => {
      setIsPictureUploadModalVisible(false);
      onSuccessfulChange();
    },
  });

  const deleteOfferImageMutation = useDeleteOfferImageMutation({
    onSuccess: async () => {
      setIsPictureUploadModalVisible(false);
      onSuccessfulChange();
    },
  });

  const addOfferVideoMutation = useAddOfferVideoMutation({
    onSuccess: async () => {
      setIsVideoLinkDeleteModalVisible(false);
      onSuccessfulChange();
    },
  });

  const deleteOfferVideoMutation = useDeleteOfferVideoMutation({
    onSuccess: async () => {
      setIsVideoLinkDeleteModalVisible(false);
      onSuccessfulChange();
    },
  });

  const enrichVideos = async (video: Video[]) => {
    const getYoutubeThumbnailUrl = (videoUrl: string) => {
      const youtubeImagePath = 'https://i.ytimg.com/vi_webp/';

      if (videoUrl.includes('v=')) {
        return `${youtubeImagePath}${
          videoUrl.split('v=')[1]
        }/maxresdefault.webp`;
      }

      if (videoUrl.includes('youtu.be/')) {
        return `${youtubeImagePath}${
          videoUrl.split('youtu.be/')[1]
        }/maxresdefault.webp`;
      }

      return '';
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
      const thumbnailUrl =
        url.includes('youtube') || url.includes('youtu.be')
          ? getYoutubeThumbnailUrl(url)
          : url.includes('vimeo')
          ? await getVimeoThumbnailUrl(url)
          : '';

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

  useEffect(() => {
    if (!videosFromQuery || videosFromQuery.length === 0) {
      setVideos([]);
      return;
    }

    enrichVideos(videosFromQuery as Video[]);
  }, [videosFromQuery]);

  useEffect(() => {
    if (!mediaObjects || mediaObjects.length === 0) {
      setImages([]);
      return;
    }
    const parsedMediaObjects = mediaObjects.map((mediaObject) => ({
      parsedId: parseOfferId(mediaObject['@id']),
      isMain: mediaObject.contentUrl === eventImage,
      ...mediaObject,
    }));

    setImages([
      ...parsedMediaObjects.filter((mediaObject) => mediaObject.isMain),
      ...parsedMediaObjects.filter((mediaObject) => !mediaObject.isMain),
    ] as ImageType[]);
  }, [eventImage, mediaObjects]);

  useEffect(() => {
    const hasImages = images.length > 0;
    const hasVideos = videos.length > 0;
    handleChangeCompleted(hasImages || hasVideos);
  }, [handleChangeCompleted, images, videos]);

  const imageToEdit = useMemo(() => {
    const image = images.find((image) => image.parsedId === imageToEditId);

    if (!image) return null;

    const { file, ...imageWithoutFile } = image;

    return imageWithoutFile;
  }, [images, imageToEditId]);

  const handleClickAddImage = () => {
    setImageToEditId(undefined);
    setIsPictureUploadModalVisible(true);
  };

  const handleDragAddImage = (files: FileList) => {
    setImageToEditId(undefined);
    setDraggedImageFile(files);
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

  const handleClickSetMainImage = useCallback(
    (imageId: string) =>
      addOfferMainImageMutation.mutate({ eventId, imageId, scope }),
    [addOfferMainImageMutation, eventId, scope],
  );

  const handleConfirmDeleteImage = (imageId: string) => {
    deleteOfferImageMutation.mutate({ eventId, imageId, scope });
    setIsPictureDeleteModalVisible(false);
  };

  const handleAddVideoLink = (url: string) => {
    addOfferVideoMutation.mutate({
      eventId,
      url,
      language: i18n.language,
      scope,
    });
    setIsVideoLinkAddModalVisible(false);
  };

  const handleDeleteVideoLink = (videoId: string) => {
    setVideoToDeleteId(videoId);
    setIsVideoLinkDeleteModalVisible(true);
  };

  const handleConfirmDeleteVideo = (videoId: string) => {
    deleteOfferVideoMutation.mutate({ eventId, videoId, scope });
    setIsVideoLinkDeleteModalVisible(false);
  };

  const handleSubmitValid = async ({
    file,
    description,
    copyrightHolder,
  }: FormData) => {
    if (imageToEdit) {
      await updateOfferImageMutation.mutateAsync({
        eventId,
        imageId: imageToEdit.parsedId,
        description,
        copyrightHolder,
        scope,
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
    <Stack {...getStackProps(props)}>
      <PictureUploadModal
        visible={isPictureUploadModalVisible}
        onClose={() => setIsPictureUploadModalVisible(false)}
        draggedImageFile={draggedImageFile}
        imageToEdit={imageToEdit}
        onSubmitValid={handleSubmitValid}
      />
      <PictureDeleteModal
        visible={isPictureDeleteModalVisible}
        onConfirm={() => handleConfirmDeleteImage(imageToDeleteId)}
        onClose={() => setIsPictureDeleteModalVisible(false)}
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
      <Inline spacing={4} alignItems="flex-start" stackOn={Breakpoints.M}>
        <PictureUploadBox
          width="45%"
          images={images}
          onClickEditImage={handleClickEditImage}
          onClickDeleteImage={handleClickDeleteImage}
          onClickSetMainImage={handleClickSetMainImage}
          onClickAddImage={handleClickAddImage}
          onDragAddImage={handleDragAddImage}
        />
        <VideoUploadBox
          width="45%"
          videos={videos}
          onClickAddVideo={() => setIsVideoLinkAddModalVisible(true)}
          onClickDeleteVideo={handleDeleteVideoLink}
        />
      </Inline>
    </Stack>
  );
};

export { MediaStep };
