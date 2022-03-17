import { useTranslation } from 'react-i18next';

import { Button, ButtonVariants } from '@/ui/Button';
import { Icons } from '@/ui/Icon';
import { Image } from '@/ui/Image';
import { Inline } from '@/ui/Inline';
import type { StackProps } from '@/ui/Stack';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { Title } from '@/ui/Title';

const getValue = getValueFromTheme('videoUploadBox');

type ImageType = {
  parsedId: string;
  description: string;
  copyrightHolder: string;
  thumbnailUrl: string;
  isMain: boolean;
  file: File;
};

type Video = {
  videoUrl: string;
  thumbnailUrl: string;
};

type Props = StackProps & {
  videos: Video[];
  onClickAddVideo: () => void;
  onClickDeleteVideo: (videoUrl: string) => void;
};

const VideoUploadBox = ({
  videos,
  onClickAddVideo,
  onClickDeleteVideo,
  ...props
}: Props) => {
  const { t } = useTranslation();

  return (
    <Stack spacing={2}>
      <Title size={3}>{t('videos.title')}</Title>
      <Stack
        flex={1}
        spacing={4}
        padding={4}
        backgroundColor={getValue('backgroundColor')}
        justifyContent="center"
        css={`
          border: 1px solid ${getValue('borderColor')};
        `}
        {...getStackProps(props)}
      >
        <Stack
          spacing={2}
          maxHeight={380}
          css={`
            overflow: auto;
          `}
        >
          {videos.map(({ videoUrl, thumbnailUrl }, index, imagesArr) => {
            const thumbnailSize = 80;
            const isLastItem = index === imagesArr.length - 1;
            return (
              <Stack
                key={videoUrl}
                spacing={4}
                padding={4}
                css={`
                  border-bottom: 1px solid
                    ${isLastItem ? 'none' : getValue('imageBorderColor')};
                `}
              >
                <Inline spacing={4} alignItems="center">
                  <Image
                    src={`${thumbnailUrl}?width=${thumbnailSize}&height=${thumbnailSize}`}
                    alt="video"
                    width={thumbnailSize}
                    height={thumbnailSize}
                    css={`
                      border: 1px solid ${getValue('thumbnailBorderColor')};
                    `}
                  />
                  <Text>{videoUrl}</Text>
                </Inline>
                <Inline spacing={3}>
                  <Button
                    variant={ButtonVariants.DANGER}
                    iconName={Icons.TRASH}
                    spacing={3}
                    onClick={() => onClickDeleteVideo(videoUrl)}
                  >
                    {t('videos.delete')}
                  </Button>
                </Inline>
              </Stack>
            );
          })}
        </Stack>
        <Stack alignItems="center" padding={4} spacing={3}>
          <Text variant={TextVariants.MUTED} textAlign="center">
            {t('videos.intro')}
          </Text>
          <Button variant={ButtonVariants.SECONDARY} onClick={onClickAddVideo}>
            {t('videos.add_button')}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export { VideoUploadBox };

export type { ImageType };
