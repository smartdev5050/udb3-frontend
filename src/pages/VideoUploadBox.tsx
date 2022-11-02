import { useTranslation } from 'react-i18next';

import { Button, ButtonVariants } from '@/ui/Button';
import { Icons } from '@/ui/Icon';
import { Image } from '@/ui/Image';
import { Inline } from '@/ui/Inline';
import type { StackProps } from '@/ui/Stack';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { getGlobalBorderRadius, getValueFromTheme } from '@/ui/theme';
import { Title } from '@/ui/Title';

const THUMBNAIL_SIZE = 80;

const getValue = getValueFromTheme('videoUploadBox');

const VideoIcon = ({ width }: { width: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-name="Layer 1"
      viewBox="0 0 512 512"
      width={width}
    >
      <g fillRule="evenodd">
        <path
          fill="#f0f0f0"
          d="M306 267.97a37.06 37.06 0 0 0 0-64.21L181.89 132.1a37.08 37.08 0 0 0-55.6 32.1v143.32a37.08 37.08 0 0 0 55.6 32.11zM13 380.04V91.68a49.98 49.98 0 0 1 49.94-49.93H387.9a49.98 49.98 0 0 1 49.94 49.93v199.49l-3.66-.83a96.9 96.9 0 0 0-41.7-.28 96.23 96.23 0 0 0-66.42 135.62l2.08 4.3H62.94A49.98 49.98 0 0 1 13 380.04zm346.63-63.82a86.18 86.18 0 0 1 136.31 45.26c16.18 59.86-33.76 115.34-93.52 108.09a86.18 86.18 0 0 1-42.79-153.35z"
        />
        <path
          fill="#999999"
          d="M463.71 384.06a8 8 0 0 1-8.02 8h-34.9v34.93a8 8 0 1 1-16 0v-34.93h-34.91a8 8 0 1 1 0-16h34.91v-34.93a8 8 0 1 1 16 0v34.93h34.91a8 8 0 0 1 8.02 8zM299.5 256.71l-124.1 71.66a24.08 24.08 0 0 1-36.14-20.85V164.2a23.26 23.26 0 0 1 12.03-20.84 23.3 23.3 0 0 1 24.11 0l124.08 71.66a24.07 24.07 0 0 1 0 41.7zm28.07-20.85a39.16 39.16 0 0 0-20.05-34.7L183.38 129.5a40.08 40.08 0 0 0-60.1 34.7v143.32a39.17 39.17 0 0 0 20.05 34.71 39.15 39.15 0 0 0 40.06 0l124.12-71.66a39.16 39.16 0 0 0 20.05-34.71zM464.1 449.53a83.18 83.18 0 1 0-116.76-14.17 83.26 83.26 0 0 0 116.76 14.17zM62.94 426.98h260.42a99.14 99.14 0 0 1 111.48-139.57V91.68a46.98 46.98 0 0 0-46.94-46.93H62.94A46.98 46.98 0 0 0 16 91.68v288.36a46.98 46.98 0 0 0 46.94 46.94zm427.9-104.1a98.34 98.34 0 0 0-40-30.4V91.69a63.02 63.02 0 0 0-62.94-62.93H62.94A63 63 0 0 0 0 91.68v288.36a63 63 0 0 0 62.94 62.94h270.1c.51.76 1.08 1.5 1.7 2.25a99.17 99.17 0 1 0 156.1-122.34z"
        />
      </g>
    </svg>
  );
};

type ImageType = {
  parsedId: string;
  description: string;
  copyrightHolder: string;
  thumbnailUrl: string;
  isMain: boolean;
  file: File;
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
      <Title size={3}>{t('videos.title')}</Title>
      <Stack
        flex={1}
        spacing={4}
        padding={4}
        borderRadius={getGlobalBorderRadius}
        backgroundColor={getValue('backgroundColor')}
        justifyContent="center"
        css={`
          border: 1px solid ${getValue('borderColor')};
        `}
      >
        <Stack
          spacing={2}
          maxHeight={380}
          css={`
            overflow: auto;
          `}
        >
          {videos.map(({ id, url, thumbnailUrl }, index, imagesArr) => {
            const isLastItem = index === imagesArr.length - 1;
            return (
              <Stack
                key={id}
                spacing={4}
                padding={4}
                css={`
                  border-bottom: 1px solid
                    ${isLastItem ? 'none' : getValue('imageBorderColor')};
                `}
              >
                <Inline spacing={4} alignItems="center">
                  <Image
                    src={`${thumbnailUrl}?width=${THUMBNAIL_SIZE}&height=${THUMBNAIL_SIZE}`}
                    alt="video"
                    width={THUMBNAIL_SIZE}
                    height={THUMBNAIL_SIZE}
                    objectFit="contain"
                    css={`
                      border: 1px solid ${getValue('thumbnailBorderColor')};
                    `}
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
                <VideoIcon width="60" />
              </Stack>
              <Text variant={TextVariants.MUTED} textAlign="center">
                {t('videos.intro')}
              </Text>
            </Stack>
          )}
          <Button
            variant={ButtonVariants.SECONDARY}
            onClick={onClickAddVideo}
            css={`
              &.btn {
                box-shadow: ${({ theme }) =>
                  theme.components.button.secondary.boxShadow.large};
              }
            `}
          >
            {t('videos.add_button')}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export { VideoUploadBox };

export type { ImageType, Video, VideoEnriched };
