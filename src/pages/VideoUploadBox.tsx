import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import { Button, ButtonVariants } from '@/ui/Button';
import { CustomIcon, CustomIconVariants } from '@/ui/CustomIcon';
import { Icons } from '@/ui/Icon';
import { Image } from '@/ui/Image';
import { Inline } from '@/ui/Inline';
import type { StackProps } from '@/ui/Stack';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { colors, getGlobalBorderRadius, getValueFromTheme } from '@/ui/theme';
import { Title } from '@/ui/Title';

import { Features, NewFeatureTooltip } from './NewFeatureTooltip';

const THUMBNAIL_SIZE = 80;

const getValue = getValueFromTheme('videoUploadBox');

const { udbMainBlue } = colors;

const VideoIcon = ({ width }: { width: string }) => {
  return (
    <CustomIcon
      color={udbMainBlue}
      name={CustomIconVariants.VIDEO}
      width={width}
    />
  );
};

type Video = {
  id: string;
  url: string;
  embedUrl: string;
  language: string;
  copyrightHolder: string;
};

type VideoEnriched = Video & {
  thumbnailUrl: string;
};

type Props = StackProps & {
  videos: VideoEnriched[];
  onClickAddVideo: () => void;
  onClickDeleteVideo: (videoId: string) => void;
};

const VideoUploadBox = ({
  videos,
  onClickAddVideo,
  onClickDeleteVideo,
  ...props
}: Props) => {
  const { t } = useTranslation();

  return (
    <Stack spacing={2} {...getStackProps(props)}>
      <Inline>
        <Title size={3}>{t('videos.title')}</Title>
        <NewFeatureTooltip featureUUID={Features.VIDEO} />
      </Inline>
      <Stack
        flex={1}
        spacing={4}
        borderRadius={getGlobalBorderRadius}
        backgroundColor={getValue('backgroundColor')}
        justifyContent="center"
        css={`
          border: 1px solid ${getValue('borderColor')};
        `}
      >
        <Stack
          spacing={4}
          maxHeight={380}
          padding={4}
          css={`
            overflow: auto;
          `}
        >
          {videos.map(({ id, url, thumbnailUrl }) => {
            return (
              <Stack
                key={id}
                spacing={4}
                padding={4}
                borderRadius={getGlobalBorderRadius}
                backgroundColor={getValue('imageBackgroundColor')}
              >
                <Inline spacing={4} alignItems="center">
                  <Image
                    src={`${thumbnailUrl}?width=${THUMBNAIL_SIZE}&height=${THUMBNAIL_SIZE}`}
                    alt="video"
                    width={THUMBNAIL_SIZE}
                    height={THUMBNAIL_SIZE}
                    objectFit="contain"
                  />
                  <Text>{url}</Text>
                </Inline>
                <Inline spacing={3}>
                  <Button
                    variant={ButtonVariants.DANGER}
                    iconName={Icons.TRASH}
                    spacing={3}
                    onClick={() => onClickDeleteVideo(id)}
                  >
                    {t('videos.delete')}
                  </Button>
                </Inline>
              </Stack>
            );
          })}
        </Stack>
        <Stack alignItems="center" padding={4} spacing={3}>
          {videos?.length === 0 && (
            <Stack alignItems="center">
              <Stack>
                <VideoIcon width="80" />
              </Stack>
              <Text variant={TextVariants.MUTED} textAlign="center">
                {t('videos.intro')}
              </Text>
            </Stack>
          )}
          <Button
            variant={ButtonVariants.SECONDARY_OUTLINE}
            onClick={onClickAddVideo}
          >
            {t('videos.add_button')}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export { VideoUploadBox };

export type { Video, VideoEnriched };
