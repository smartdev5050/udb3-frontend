import { yupResolver } from '@hookform/resolvers/yup';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { InputWithLabel } from '@/ui/InputWithLabel';
import { Modal, ModalSizes, ModalVariants } from '@/ui/Modal';
import { Paragraph } from '@/ui/Paragraph';
import type { StackProps } from '@/ui/Stack';
import { Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { TextAreaWithLabel } from '@/ui/TextAreaWithLabel';
import { getValueFromTheme } from '@/ui/theme';

import type { MachineProps } from './create';
import { Step } from './Step';

const getValue = getValueFromTheme('moviesCreatePage');

type Step5Props = StackProps & MachineProps;

type FormData = {
  description: string;
  copyright: string;
};

const PictureUploadModal = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const formComponent = useRef<HTMLFormElement>();

  const schema = yup
    .object()
    .shape({
      description: yup.string().required().max(250),
      copyright: yup.string().required(),
    })
    .required();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  return (
    <Modal
      title={t('movies.create.modal.title')}
      visible={visible}
      variant={ModalVariants.QUESTION}
      onClose={onClose}
      confirmTitle="Opladen"
      cancelTitle="Annuleren"
      size={ModalSizes.MD}
      onConfirm={() => {
        formComponent.current.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true }),
        );
      }}
      confirmButtonDisabled={Object.keys(errors).length > 0}
    >
      <Stack
        as="form"
        ref={formComponent}
        spacing={4}
        padding={4}
        onSubmit={handleSubmit()}
      >
        <Stack
          flex={1}
          spacing={4}
          height={300}
          backgroundColor={getValue('pictureUploadBox.backgroundColor')}
          justifyContent="center"
          alignItems="center"
          css={`
            border: 1px solid ${getValue('pictureUploadBox.borderColor')};
          `}
          padding={4}
        >
          <Text fontWeight={700}>Selecteer je foto</Text>
          <Icon
            name={Icons.IMAGE}
            width="4rem"
            height="4rem"
            color={getValue('pictureUploadBox.imageIconColor')}
          />
          <Stack spacing={2} alignItems="center">
            <Text>Sleep een bestand hierheen of</Text>
            <Button>Kies bestand</Button>
          </Stack>
          <Text variant={TextVariants.MUTED} textAlign="center">
            De maximale grootte van je afbeelding is 5MB en heeft als type
            .jpeg, .gif of .png
          </Text>
        </Stack>
        <InputWithLabel
          id="description"
          label="Beschrijving"
          info="Maximum 250 karakters"
          required
          error={
            errors.description &&
            t(
              `movies.create.modal.validation_messages.description.${errors.description.type}`,
            )
          }
          {...register('description')}
        />

        <InputWithLabel
          id="copyright"
          label="Copyright"
          required
          info={
            <Stack spacing={3}>
              <Paragraph>
                Vermeld de naam van de rechtenhoudende fotograaf. Vul alleen de
                naam van je eigen vereniging of organisatie in als je zelf de
                rechten bezit (minimum 2 karakters).
              </Paragraph>
              <Paragraph>
                Je staat op het punt (een) afbeelding(en) toe te voegen en
                openbaar te verspreiden. Je dient daartoe alle geldende auteurs-
                en portretrechten te respecteren, alsook alle andere
                toepasselijke wetgeving. Je kan daarvoor aansprakelijk worden
                gehouden, zoals vastgelegd in de algemene voorwaarden. Meer
                informatie over copyright
              </Paragraph>
            </Stack>
          }
          error={
            errors.copyright &&
            t(
              `movies.create.modal.validation_messages.copyright.${errors.copyright.type}`,
            )
          }
          {...register('copyright')}
        />
        <Text>
          <Text color="red">*</Text> verplicht veld
        </Text>
      </Stack>
    </Modal>
  );
};

const Step5 = ({ movieState, sendMovieEvent, ...props }: Step5Props) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleClickAddImage = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  return (
    <Step stepNumber={5}>
      <PictureUploadModal visible={isModalVisible} onClose={handleCloseModal} />
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
            Voeg een afbeelding toe zodat bezoekers je activiteit beter
            herkennen
          </Text>
          <Button
            variant={ButtonVariants.SECONDARY}
            onClick={handleClickAddImage}
          >
            Afbeelding toevoegen
          </Button>
        </Stack>
      </Inline>
    </Step>
  );
};

export { Step5 };
