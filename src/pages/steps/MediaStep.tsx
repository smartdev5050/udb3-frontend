import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useAddEventMainImageMutation,
  useAddImageToEventMutation,
  useAddVideoToEventMutation,
  useDeleteImageFromEventMutation,
  useDeleteVideoFromEventMutation,
  useGetEventByIdQuery,
  useUpdateImageFromEventMutation,
} from '@/hooks/api/events';
import { useAddImageMutation } from '@/hooks/api/images';
import type { FormData } from '@/pages/steps/modals/PictureUploadModal';
import { Inline } from '@/ui/Inline';
import { getStackProps, Stack } from '@/ui/Stack';
import { Breakpoints } from '@/ui/theme';
import { parseOfferId } from '@/utils/parseOfferId';

import type { ImageType } from '../PictureUploadBox';
import { PictureUploadBox } from '../PictureUploadBox';
import { VideoLinkAddModal } from '../VideoLinkAddModal';
import { VideoLinkDeleteModal } from '../VideoLinkDeleteModal';
import type { Video, VideoEnriched } from '../VideoUploadBox';
import { VideoUploadBox } from '../VideoUploadBox';
import { PictureDeleteModal } from './modals/PictureDeleteModal';
import { PictureUploadModal } from './modals/PictureUploadModal';

type Props = {
  eventId?: string;
  onSuccessfulChange: () => void;
  onChangeCompleted: (completed: boolean) => void;
};

const MediaStep = ({
  eventId,
  onSuccessfulChange,
  onChangeCompleted,
  ...props
}: Props) => {
  const { i18n } = useTranslation();

  const getEventByIdQuery = useGetEventByIdQuery({ id: eventId });

  // @ts-expect-error
  const videosFromQuery = useMemo(() => getEventByIdQuery.data?.videos ?? [], [
    // @ts-expect-error
    getEventByIdQuery.data?.videos,
  ]);

  const mediaObjects = useMemo(
    // @ts-expect-error
    () => getEventByIdQuery.data?.mediaObject ?? [],
    // @ts-expect-error
    [getEventByIdQuery.data?.mediaObject],
  );

  const eventImage = useMemo(
    // @ts-expect-error
    () => getEventByIdQuery.data?.image ?? [],
    // @ts-expect-error
    [getEventByIdQuery.data?.image],
  );

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

  const [imageToEditId, setImageToEditId] = useState('');
  const [draggedImageFile, setDraggedImageFile] = useState<FileList>();
  const [imageToDeleteId, setImageToDeleteId] = useState('');
  const [videoToDeleteId, setVideoToDeleteId] = useState('');

  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState<ImageType[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSetImages = useCallback(setImages, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSetVideos = useCallback(setVideos, []);

  const addImageToEventMutation = useAddImageToEventMutation({
    onSuccess: async () => {
      setIsPictureUploadModalVisible(false);
      onSuccessfulChange();
    },
  });

  const handleSuccessAddImage = ({ imageId }) => {
    return addImageToEventMutation.mutate({ eventId, imageId });
  };

  const addImageMutation = useAddImageMutation({
    onSuccess: handleSuccessAddImage,
  });

  const addEventMainImageMutation = useAddEventMainImageMutation({
    onSuccess: onSuccessfulChange,
  });

  const updateImageFromEventMutation = useUpdateImageFromEventMutation({
    onSuccess: async () => {
      setIsPictureUploadModalVisible(false);
      onSuccessfulChange();
    },
  });

  const deleteImageFromEventMutation = useDeleteImageFromEventMutation({
    onSuccess: async () => {
      setIsPictureUploadModalVisible(false);
      onSuccessfulChange();
    },
  });

  const addVideoToEventMutation = useAddVideoToEventMutation({
    onSuccess: async () => {
      setIsVideoLinkDeleteModalVisible(false);
      onSuccessfulChange();
    },
  });

  const deleteVideoFromEventMutation = useDeleteVideoFromEventMutation({
    onSuccess: async () => {
      setIsVideoLinkDeleteModalVisible(false);
      onSuccessfulChange();
    },
  });

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

    handleSetVideos(data);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeCompleted = useCallback(onChangeCompleted, []);

  useEffect(() => {
    if (!videosFromQuery || videosFromQuery.length === 0) {
      handleSetVideos([]);
      return;
    }

    enrichVideos(videosFromQuery as Video[]);

    handleChangeCompleted(true);
  }, [videosFromQuery, handleSetVideos, handleChangeCompleted]);

  useEffect(() => {
    if (!mediaObjects || mediaObjects.length === 0) {
      handleSetImages([]);
      return;
    }
    const parsedMediaObjects = mediaObjects.map((mediaObject) => ({
      parsedId: parseOfferId(mediaObject['@id']),
      isMain: mediaObject.contentUrl === eventImage,
      ...mediaObject,
    }));

    handleSetImages([
      ...parsedMediaObjects.filter((mediaObject) => mediaObject.isMain),
      ...parsedMediaObjects.filter((mediaObject) => !mediaObject.isMain),
    ] as ImageType[]);

    handleChangeCompleted(true);
  }, [eventImage, mediaObjects, handleSetImages, handleChangeCompleted]);

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
    (imageId: string) => addEventMainImageMutation.mutate({ eventId, imageId }),
    [addEventMainImageMutation, eventId],
  );

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
      <Inline spacing={4} flex={1} stackOn={Breakpoints.M}>
        <PictureUploadBox
          images={images}
          onClickEditImage={handleClickEditImage}
          onClickDeleteImage={handleClickDeleteImage}
          onClickSetMainImage={handleClickSetMainImage}
          onClickAddImage={handleClickAddImage}
          onDragAddImage={handleDragAddImage}
        />
        <VideoUploadBox
          videos={videos}
          onClickAddVideo={() => setIsVideoLinkAddModalVisible(true)}
          onClickDeleteVideo={handleDeleteVideoLink}
        />
      </Inline>
    </Stack>
  );
};

export { MediaStep };
