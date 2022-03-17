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

const getValue = getValueFromTheme('pictureUploadBox');

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
};

const PictureUploadBox = ({
  images,
  onClickEditImage,
  onClickDeleteImage,
  onClickSetMainImage,
  onClickAddImage,
  ...props
}: Props) => {
  const { t } = useTranslation();

  return (
    <Stack spacing={2}>
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
            const thumbnailSize = 80;
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
                    src={`${image.thumbnailUrl}?width=${thumbnailSize}&height=${thumbnailSize}`}
                    alt={image.description}
                    width={thumbnailSize}
                    height={thumbnailSize}
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
          <Text variant={TextVariants.MUTED} textAlign="center">
            {t('pictures.intro')}
          </Text>
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
