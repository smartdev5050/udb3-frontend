import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

import {
  useAddEventMainImageMutation,
  useAddImageToEventMutation,
  useAddOrganizerToEventMutation,
  useAddPriceInfoMutation,
  useAddVideoToEventMutation,
  useDeleteImageFromEventMutation,
  useDeleteOrganizerFromEventMutation,
  useDeleteVideoFromEventMutation,
  useGetEventByIdQuery,
  useUpdateImageFromEventMutation,
} from '@/hooks/api/events';
import { useAddImageMutation } from '@/hooks/api/images';
import { useCreateOrganizerMutation } from '@/hooks/api/organizers';
import { PictureDeleteModal } from '@/pages/steps/modals/PictureDeleteModal';
import type { FormData } from '@/pages/steps/modals/PictureUploadModal';
import { PictureUploadModal } from '@/pages/steps/modals/PictureUploadModal';
import {
  defaultPriceInfoValues,
  FormData as PriceInfoFormData,
  PriceInfoModal,
  Rate,
} from '@/pages/steps/modals/PriceInfoModal';
import type { Values } from '@/types/Values';
import { Alert } from '@/ui/Alert';
import { Box, parseSpacing } from '@/ui/Box';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { getInlineProps, Inline, InlineProps } from '@/ui/Inline';
import { ProgressBar, ProgressBarVariants } from '@/ui/ProgressBar';
import type { StackProps } from '@/ui/Stack';
import { getStackProps, Stack } from '@/ui/Stack';
import { Tabs } from '@/ui/Tabs';
import { Text, TextVariants } from '@/ui/Text';
import { parseOfferId } from '@/utils/parseOfferId';

import { OrganizerAddModal, OrganizerData } from '../OrganizerAddModal';
import type { ImageType } from '../PictureUploadBox';
import { PictureUploadBox } from '../PictureUploadBox';
import { VideoLinkAddModal } from '../VideoLinkAddModal';
import { VideoLinkDeleteModal } from '../VideoLinkDeleteModal';
import type { Video, VideoEnriched } from '../VideoUploadBox';
import { VideoUploadBox } from '../VideoUploadBox';
import { Audience } from './Audience';
import { ContactInfo } from './ContactInfo';
import { DescriptionStep } from './DescriptionStep';
import { OrganizerPicker } from './OrganizerPicker';
import { PriceInformation } from './PriceInformation';

const AdditionalInformationStepVariant = {
  MINIMAL: 'minimal',
  EXTENDED: 'extended',
} as const;

type Field =
  | 'description'
  | 'image'
  | 'video'
  | 'contactInfo'
  | 'priceInfo'
  | 'audience'
  | 'organizer';

type TabConfig = {
  eventKey: string;
  title: string;
  Component: ReactNode;
  visible: boolean;
  completed: boolean;
};

type TabTitleProps = InlineProps & {
  title: string;
  completed: boolean;
};

const TabTitle = ({ title, completed, ...props }: TabTitleProps) => {
  return (
    <Inline spacing={3} {...getInlineProps(props)}>
      {completed && <Icon name={Icons.CHECK_CIRCLE} color="#48874a" />}
      <Text>{title}</Text>
    </Inline>
  );
};

type Props = StackProps & {
  eventId: string;
  onChangeSuccess: (field: Field) => void;
  variant?: Values<typeof AdditionalInformationStepVariant>;
};

const AdditionalInformationStep = ({
  eventId,
  onChangeSuccess,
  variant,
  ...props
}: Props) => {
  const queryClient = useQueryClient();

  const invalidateEventQuery = useCallback(
    async (field: Field) => {
      await queryClient.invalidateQueries(['events', { id: eventId }]);
      onChangeSuccess(field);
    },
    [eventId, onChangeSuccess, queryClient],
  );

  const { t, i18n } = useTranslation();

  const [tab, setTab] = useState('description');

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
  const [isOrganizerAddModalVisible, setIsOrganizerAddModalVisible] = useState(
    false,
  );
  const [isPriceInfoModalVisible, setIsPriceInfoModalVisible] = useState(false);

  const [isDescriptionCompleted, setIsDescriptionCompleted] = useState(false);

  const [newOrganizerName, setNewOrganizerName] = useState('');
  const [imageToEditId, setImageToEditId] = useState('');
  const [draggedImageFile, setDraggedImageFile] = useState<FileList>();
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

  const createOrganizerMutation = useCreateOrganizerMutation();

  const addOrganizerToEventMutation = useAddOrganizerToEventMutation({
    onSuccess: async () => {
      await invalidateEventQuery('organizer');
    },
  });

  const deleteOrganizerFromEventMutation = useDeleteOrganizerFromEventMutation({
    onSuccess: async () => {
      await invalidateEventQuery('organizer');
    },
  });

  useEffect(() => {
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
    // @ts-expect-error
  }, [getEventByIdQuery.data?.image, getEventByIdQuery.data?.mediaObject]);

  const priceInfo = useMemo(() => {
    if (variant !== AdditionalInformationStepVariant.EXTENDED) {
      return [];
    }
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
    variant,
  ]);

  const eventContactInfo = useMemo(() => {
    if (variant !== AdditionalInformationStepVariant.EXTENDED) return;
    // @ts-expect-error
    return getEventByIdQuery.data?.contactPoint;
    // @ts-expect-error
  }, [getEventByIdQuery.data?.contactPoint, variant]);

  const eventBookingInfo = useMemo(() => {
    if (variant !== AdditionalInformationStepVariant.EXTENDED) return;
    // @ts-expect-error
    return getEventByIdQuery.data?.bookingInfo;
    // @ts-expect-error
  }, [getEventByIdQuery.data?.bookingInfo, variant]);

  const audienceType = useMemo(() => {
    if (variant !== AdditionalInformationStepVariant.EXTENDED) {
      return;
    }
    // @ts-expect-error
    return getEventByIdQuery.data?.audience?.audienceType;
    // @ts-expect-error
  }, [getEventByIdQuery.data?.audience?.audienceType, variant]);

  // @ts-expect-error
  const organizer = getEventByIdQuery.data?.organizer;

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
    getEventByIdQuery.data?.terms,
  ]);

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

  const handleAddOrganizer = async ({ url, name, address }: OrganizerData) => {
    const payload = {
      mainLanguage: i18n.language,
      url,
      name: {
        [i18n.language]: name,
      },
      address: {
        [i18n.language]: {
          addressCountry: address.country,
          addressLocality: address.city.name,
          postalCode: address.city.zip,
          streetAddress: address.streetAndNumber,
        },
      },
    };
    const { organizerId } = await createOrganizerMutation.mutateAsync(payload);

    await addOrganizerToEventMutation.mutateAsync({ eventId, organizerId });

    setIsOrganizerAddModalVisible(false);
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
    onSuccess: async () => {
      await invalidateEventQuery('priceInfo');
      setIsPriceInfoModalVisible(false);
    },
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

  const tabsConfigurations = useMemo<TabConfig[]>(() => {
    const handleChangeOrganizer = (organizerId: string) => {
      addOrganizerToEventMutation.mutate({ eventId, organizerId });
    };

    const handleAddFreePriceInfo = async () => {
      const freePriceInfoRates = defaultPriceInfoValues.rates;
      // @ts-expect-error
      freePriceInfoRates[0].price = 0;
      await addPriceInfoMutation.mutateAsync({
        eventId,
        priceInfo: freePriceInfoRates,
      });
    };

    return [
      {
        eventKey: 'description',
        title: t('create.additionalInformation.description.title'),
        Component: (
          <DescriptionStep
            eventId={eventId}
            completed={isDescriptionCompleted}
            onChangeCompleted={(isCompleted) =>
              setIsDescriptionCompleted(isCompleted)
            }
            onSuccessfulChange={() => invalidateEventQuery('description')}
          />
        ),
        visible: true,
        completed: isDescriptionCompleted,
      },
      {
        eventKey: 'organizer',
        title: t('create.additionalInformation.organizer.title'),
        Component: (
          <OrganizerPicker
            organizer={organizer}
            onChange={handleChangeOrganizer}
            onAddNewOrganizer={(newOrganizer) => {
              setNewOrganizerName(newOrganizer.label);
              setIsOrganizerAddModalVisible(true);
            }}
            onDeleteOrganizer={(organizerId) =>
              deleteOrganizerFromEventMutation.mutate({
                eventId,
                organizerId,
              })
            }
          />
        ),
        visible: variant === AdditionalInformationStepVariant.EXTENDED,
        completed: true,
      },
      {
        eventKey: 'priceInfo',
        title: t('create.additionalInformation.price_info.title'),
        Component: (
          <PriceInformation
            priceInfo={priceInfo}
            onClickAddPriceInfo={() => setIsPriceInfoModalVisible(true)}
            onClickAddFreePriceInfo={() => handleAddFreePriceInfo()}
          />
        ),
        visible: variant === AdditionalInformationStepVariant.EXTENDED,
        completed: true,
      },
      {
        eventKey: 'contactInfo',
        title: t('create.additionalInformation.contact_info.title'),
        Component: (
          <ContactInfo
            eventContactInfo={eventContactInfo}
            eventBookingInfo={eventBookingInfo}
          />
        ),
        visible: variant === AdditionalInformationStepVariant.EXTENDED,
        completed: true,
      },
      {
        eventKey: 'audience',
        title: 'audience',
        Component: (
          <Audience
            eventId={eventId}
            selectedAudience={audienceType}
            onChangeSuccess={() => invalidateEventQuery('audience')}
          />
        ),
        visible: variant === AdditionalInformationStepVariant.EXTENDED,
        completed: true,
      },
      {
        eventKey: 'imagesAndVideos',
        title: 'imagesAndVideos',
        title: t('create.additionalInformation.pictures_and_videos.title'),
        Component: (
          <Inline spacing={4} flex={1}>
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
        ),
        visible: true,
        completed: true,
      },
    ];
  }, [
    addOrganizerToEventMutation,
    addPriceInfoMutation,
    audienceType,
    deleteOrganizerFromEventMutation,
    eventBookingInfo,
    eventContactInfo,
    eventId,
    handleClickSetMainImage,
    images,
    invalidateEventQuery,
    isDescriptionCompleted,
    organizer,
    priceInfo,
    t,
    variant,
    videos,
  ]);

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
      <OrganizerAddModal
        prefillName={newOrganizerName}
        visible={isOrganizerAddModalVisible}
        onConfirm={handleAddOrganizer}
        onClose={() => setIsOrganizerAddModalVisible(false)}
      />

      <Tabs
        activeKey={tab}
        onSelect={setTab}
        css={`
          .tab-content {
            padding-top: ${parseSpacing(3)};
          }
        `}
      >
        {tabsConfigurations.map(
          ({ eventKey, title, Component, visible, completed }) =>
            visible && (
              <Tabs.Tab
                key={eventKey}
                eventKey={eventKey}
                title={<TabTitle title={title} completed={completed} />}
              >
                {Component}
              </Tabs.Tab>
            ),
        )}
      </Tabs>
    </Stack>
  );
};

AdditionalInformationStep.defaultProps = {
  variant: AdditionalInformationStepVariant.EXTENDED,
};

const additionalInformationStepConfiguration = {
  Component: AdditionalInformationStep,
  title: (t) => t(`movies.create.step5.title`),
};

export {
  additionalInformationStepConfiguration,
  AdditionalInformationStepVariant,
};
