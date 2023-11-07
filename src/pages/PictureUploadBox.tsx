import { DragEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Scope, ScopeTypes } from '@/constants/OfferType';
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

const THUMBNAIL_SIZE = 80;

const { udbMainBlue } = colors;

const getValue = getValueFromTheme('pictureUploadBox');

const ImageIcon = ({ width }: { width: string }) => {
  return (
    <CustomIcon
      color={udbMainBlue}
      name={CustomIconVariants.IMAGE}
      width={width}
    />
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
  scope: Scope;
  images: ImageType[];
  onClickEditImage: (id: string) => void;
  onClickDeleteImage: (id: string) => void;
  onClickSetMainImage: (id: string) => void;
  onClickAddImage: () => void;
  onDragAddImage: (file: FileList) => void;
};

const PictureUploadBox = ({
  scope,
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
      {...getStackProps(props)}
    >
      <Inline>
        <Title size={3} minHeight="26px">
          {t('pictures.title')}
        </Title>
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
          {images.map((image) => {
            return (
              <Stack
                key={image.parsedId}
                spacing={4}
                padding={4}
                borderRadius={getGlobalBorderRadius}
                backgroundColor={
                  image.isMain
                    ? getValue('mainImageBackgroundColor')
                    : getValue('imageBackgroundColor')
                }
              >
                <Inline spacing={4} alignItems="center" paddingX={4}>
                  <Image
                    src={`${image.thumbnailUrl}?width=${THUMBNAIL_SIZE}&height=${THUMBNAIL_SIZE}`}
                    alt={image.description}
                    width={THUMBNAIL_SIZE}
                    height={THUMBNAIL_SIZE}
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
            <Stack alignItems="center">
              <Stack>
                <ImageIcon width="80" />
              </Stack>
              <Text variant={TextVariants.MUTED} textAlign="center">
                {scope === ScopeTypes.ORGANIZERS
                  ? t('organizers.create.step2.pictures.intro')
                  : t('pictures.intro')}
              </Text>
            </Stack>
          )}
          <Button
            variant={ButtonVariants.SECONDARY_OUTLINE}
            onClick={onClickAddImage}
          >
            {t('pictures.add_button')}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export { ImageIcon, PictureUploadBox };

export type { ImageType };
