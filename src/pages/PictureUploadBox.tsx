import { DragEvent } from 'react';
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

const THUMBNAIL_SIZE = 80;

const getValue = getValueFromTheme('pictureUploadBox');

const ImageIcon = ({ width }: { width: string }) => {
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
          d="M450.31 379.78a5 5 0 0 0 0-7.06l-33.97-33.97a5 5 0 0 0-7.08 0l-33.96 33.97a5 5 0 1 0 7.07 7.06l25.43-25.42v71.52a5 5 0 0 0 10 0v-71.52l25.43 25.42a5.03 5.03 0 0 0 7.08 0zM13 268.08l118.9-100.55L298 283.94a5 5 0 1 0 5.74-8.19L267.7 250.5l114.78-82.74 55.36 55.38v68.04l-3.66-.83a96.1 96.1 0 0 0-116.86 82.14 95.57 95.57 0 0 0 8.75 53.21l2.07 4.3H62.94A49.99 49.99 0 0 1 13 380.07v-112zM212.57 138.3a39.68 39.68 0 1 0 39.67-39.67 39.72 39.72 0 0 0-39.67 39.67zm200.06 159.59c51.6 0 91.98 45.05 85.73 96.58a86.18 86.18 0 1 1-85.73-96.58z"
        />
        <path
          fill="#999999"
          d="M452.43 370.6a8 8 0 0 1-11.32 11.3l-20.31-20.3v64.28a8 8 0 0 1-16 0V361.6l-20.31 20.3a8 8 0 0 1-11.3-11.3l33.95-33.97a8.01 8.01 0 0 1 11.32 0zm42.95 23.5a83.18 83.18 0 0 0-72.56-92.6 85.26 85.26 0 0 0-10.19-.61 83.19 83.19 0 1 0 82.75 93.22zM62.93 427h260.43a99.16 99.16 0 0 1 111.48-139.57v-63.05l-52.68-52.7-109.29 78.79 32.58 22.84a8 8 0 1 1-9.18 13.1l-164.2-115.1L16 269.47v110.6A46.99 46.99 0 0 0 62.93 427zm0-382.22h324.98a46.98 46.98 0 0 1 46.93 46.93v110.04l-46.18-46.18a8 8 0 0 0-10.34-.84L259 240.75l-122.79-86.08a8 8 0 0 0-9.76.45L16 248.52V91.71a46.98 46.98 0 0 1 46.93-46.93zm427.94 278.14a98.52 98.52 0 0 0-40.03-30.4V91.7a63 63 0 0 0-62.93-62.93H62.93A63 63 0 0 0 0 91.71v288.36a63.01 63.01 0 0 0 62.93 62.94h270.1c.55.75 1.12 1.5 1.7 2.24a99.18 99.18 0 1 0 156.14-122.33zm-238.63-221.3a36.67 36.67 0 1 1-36.67 36.68 36.72 36.72 0 0 1 36.67-36.67zm0 89.35a52.67 52.67 0 1 1 52.67-52.67 52.73 52.73 0 0 1-52.67 52.67z"
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

type Props = StackProps & {
  images: ImageType[];
  onClickEditImage: (id: string) => void;
  onClickDeleteImage: (id: string) => void;
  onClickSetMainImage: (id: string) => void;
  onClickAddImage: () => void;
  onDragAddImage: (file: FileList) => void;
};

const PictureUploadBox = ({
  images,
  onClickEditImage,
  onClickDeleteImage,
  onClickSetMainImage,
  onClickAddImage,
  onDragAddImage,
  ...props
}: Props) => {
  const { t } = useTranslation();

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    if (!e) return;

    e.preventDefault();

    const files = e.dataTransfer.files;

    if (files.length === 0) return;

    onDragAddImage(files);
  };

  return (
    <Stack
      spacing={2}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <Title size={3}>{t('pictures.title')}</Title>
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
          {images.map((image, index, imagesArr) => {
            const isLastItem = index === imagesArr.length - 1;
            return (
              <Stack
                key={image.parsedId}
                spacing={4}
                padding={4}
                backgroundColor={
                  image.isMain ? getValue('mainImageBackgroundColor') : 'none'
                }
                css={`
                  border-bottom: 1px solid
                    ${image.isMain
                      ? getValue('mainImageBorderColor')
                      : `${
                          isLastItem ? 'none' : getValue('imageBorderColor')
                        }`};
                `}
              >
                <Inline spacing={4} alignItems="center">
                  <Image
                    src={`${image.thumbnailUrl}?width=${THUMBNAIL_SIZE}&height=${THUMBNAIL_SIZE}`}
                    alt={image.description}
                    width={THUMBNAIL_SIZE}
                    height={THUMBNAIL_SIZE}
                    css={`
                      border: 1px solid ${getValue('thumbnailBorderColor')};
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
                    onClick={() => onClickEditImage(image.parsedId)}
                  >
                    {t('pictures.change')}
                  </Button>
                  <Button
                    variant={ButtonVariants.DANGER}
                    iconName={Icons.TRASH}
                    spacing={3}
                    onClick={() => onClickDeleteImage(image.parsedId)}
                  >
                    {t('pictures.delete')}
                  </Button>
                  {!image.isMain && (
                    <Button
                      variant={ButtonVariants.SECONDARY}
                      onClick={() => onClickSetMainImage(image.parsedId)}
                    >
                      {t('pictures.set_as_main_image')}
                    </Button>
                  )}
                </Inline>
              </Stack>
            );
          })}
        </Stack>
        <Stack alignItems="center" padding={4} spacing={3}>
          {images.length === 0 && (
            <>
              <Stack>
                <ImageIcon width="60" />
              </Stack>
              <Text variant={TextVariants.MUTED} textAlign="center">
                {t('pictures.intro')}
              </Text>
            </>
          )}
          <Button variant={ButtonVariants.SECONDARY} onClick={onClickAddImage}>
            {t('pictures.add_button')}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export { PictureUploadBox };

export type { ImageType };
