import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { CalendarType } from '@/constants/CalendarType';
import { useAddPlaceMutation } from '@/hooks/api/places';
import { useGetTypesByScopeQuery } from '@/hooks/api/types';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { Modal, ModalSizes, ModalVariants } from '@/ui/Modal';
import { Paragraph } from '@/ui/Paragraph';
import { Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';

import { City } from './CityPicker';

const schema = yup
  .object({
    name: yup.string().required(),
    streetAndNumber: yup.string().required(),
    zip: yup.string().required(),
    municipalityName: yup.string().required(),
    type: yup.object({
      label: yup.string().required(),
      domain: yup.string().required(),
      id: yup.string().required(),
    }),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

type Props = {
  visible: boolean;
  municipality: City;
  onClose: () => void;
};

const PlaceAddModal = ({ visible, onClose, municipality }: Props) => {
  const { t, i18n } = useTranslation();

  console.log({ municipality });

  const getTypesByScopeQuery = useGetTypesByScopeQuery({
    scope: 'places',
  });

  const types = getTypesByScopeQuery.data ?? [];

  const addPlaceMutation = useAddPlaceMutation();

  const handleConfirm = async () => {
    await handleSubmit(async (data) => {
      console.log('submit handled');

      const formData = {
        address: {
          addressCountry: 'BE', // TODO get country from event form
          addressLocality: data.municipalityName,
          postalCode: data.zip,
          streetAddress: data.streetAndNumber,
        },
        calendar: {
          calendarType: CalendarType.PERMANENT,
        },
        mainLanguage: i18n.language,
        name: data.name,
        type: data.type,
      };

      const resp = await addPlaceMutation.mutateAsync({ ...formData });
      console.log({ resp });
    })();
  };

  const handleClose = () => {
    onClose();
  };

  const {
    register,
    handleSubmit,
    formState,
    control,
    reset,
    watch,
    setValue,
    setError,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!municipality) return;
    setValue('zip', municipality.zip);
    setValue('municipalityName', municipality.name);
  }, [municipality, setValue]);

  const selectedType = watch('type');

  console.log({ selectedType });

  return (
    <Modal
      title="Nieuwe locatie toevoegen"
      confirmTitle="Toevoegen"
      cancelTitle="Annuleren"
      visible={visible}
      variant={ModalVariants.QUESTION}
      onConfirm={handleConfirm}
      onClose={handleClose}
      size={ModalSizes.LG}
    >
      <Stack padding={4} spacing={4}>
        <FormElement
          Component={<Input {...register('name')} />}
          id="location-name"
          label="Naam locatie"
        />
        <FormElement
          Component={<Input {...register('streetAndNumber')} />}
          id="location-street"
          label="Straat en nummer"
        />
        <Inline spacing={5}>
          <FormElement
            Component={<Input {...register('zip')} disabled />}
            id="location-zip"
            label="Postcode"
          />
          <FormElement
            Component={<Input {...register('municipalityName')} disabled />}
            id="location-municipality-name"
            label="Gemeente"
          />
        </Inline>
        <Stack>
          <Text fontWeight="bold">Categorie</Text>
          <Paragraph marginBottom={3} variant={TextVariants.MUTED}>
            Kies een categorie die deze locatie het best omschrijft.
          </Paragraph>
          <Inline spacing={3} flexWrap="wrap" maxWidth="70rem">
            {types.map(({ id, name, domain }) => (
              <Button
                width="auto"
                marginBottom={3}
                display="inline-flex"
                key={id}
                active={id === selectedType?.id}
                variant={ButtonVariants.SECONDARY}
                onClick={() =>
                  setValue('type', {
                    id,
                    label: name[i18n.language],
                    domain,
                  })
                }
              >
                {name[i18n.language]}
              </Button>
            ))}
          </Inline>
        </Stack>
      </Stack>
    </Modal>
  );
};

export { PlaceAddModal };
