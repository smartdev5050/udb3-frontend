import { useTranslation } from 'react-i18next';

import { Button, ButtonVariants } from '@/ui/Button';
import { Inline } from '@/ui/Inline';
import { Modal, ModalVariants } from '@/ui/Modal';
import type { StackProps } from '@/ui/Stack';
import { Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { TextAreaWithLabel } from '@/ui/TextAreaWithLabel';
import { getValueFromTheme } from '@/ui/theme';

import type { MachineProps } from './create';
import { Step } from './Step';

const getValue = getValueFromTheme('moviesCreatePage');

type Step5Props = StackProps & MachineProps;

const PictureUploadModal = () => {
  return <Modal visible variant={ModalVariants.CONTENT} size="lg" />;
};

const PictureUploadBox = (props) => {
  return (
    <Stack
      flex={1}
      spacing={3}
      height={300}
      backgroundColor={getValue('pictureUploadBox.backgroundColor')}
      justifyContent="center"
      alignItems="center"
      css={`
        border: 1px solid ${getValue('pictureUploadBox.borderColor')};
      `}
      {...props}
    >
      <Text variant={TextVariants.MUTED}>
        Voeg een afbeelding toe zodat bezoekers je activiteit beter herkennen
      </Text>
      <Button variant={ButtonVariants.SECONDARY}>Afbeelding toevoegen</Button>
    </Stack>
  );
};

const Step5 = ({ movieState, sendMovieEvent, ...props }: Step5Props) => {
  const { t } = useTranslation();

  return (
    <Step stepNumber={5}>
      <PictureUploadModal />
      <Inline spacing={6}>
        <Stack spacing={3} flex={1}>
          <TextAreaWithLabel
            label={t('movies.create.actions.description')}
            value=""
            onInput={() => {}}
            rows={10}
          />
          <Button variant={ButtonVariants.LINK}>leegmaken</Button>
        </Stack>
        <PictureUploadBox />
      </Inline>
    </Step>
  );
};

export { Step5 };
