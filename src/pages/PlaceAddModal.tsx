import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { CalendarType } from '@/constants/CalendarType';
import { getPlaceById, useAddPlaceMutation } from '@/hooks/api/places';
import { useGetTypesByScopeQuery } from '@/hooks/api/types';
import { useHeaders } from '@/hooks/api/useHeaders';
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
  prefillPlaceName: string;
  onClose: () => void;
  onConfirmSuccess: (place: any) => void;
};

const PlaceAddModal = ({
  visible,
  onClose,
  municipality,
  prefillPlaceName,
  onConfirmSuccess,
}: Props) => {
  const { t, i18n } = useTranslation();

  const getTypesByScopeQuery = useGetTypesByScopeQuery({
    scope: 'places',
  });

  const headers = useHeaders();

  const types = getTypesByScopeQuery.data ?? [];

  const addPlaceMutation = useAddPlaceMutation();

  const handleConfirm = async () => {
    await handleSubmit(async (data) => {
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

      const resp = await addPlaceMutation.mutateAsync(formData);

      if (!resp?.placeId) return;

      const newPlace = await getPlaceById({ headers, id: resp.placeId });
      onConfirmSuccess(newPlace);
    })();
  };

  const handleClose = () => {
    onClose();
    clearErrors();
  };

  const {
    register,
    handleSubmit,
    formState,
    watch,
    setValue,
    trigger,
    clearErrors,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!municipality) return;
    setValue('zip', municipality.zip);
    setValue('municipalityName', municipality.name);
  }, [municipality, setValue]);

  useEffect(() => {
    if (!prefillPlaceName) return;
    setValue('name', prefillPlaceName);
  }, [prefillPlaceName, setValue]);

  const selectedType = watch('type');

  return (
    <Modal
      title={t('location.add_modal.title')}
      confirmTitle={t('location.add_modal.actions.add')}
      cancelTitle={t('location.add_modal.actions.cancel')}
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
          label={t('location.add_modal.labels.name')}
          error={formState.errors.name && t('location.add_modal.errors.name')}
        />
        <FormElement
          Component={<Input {...register('streetAndNumber')} />}
          id="location-street"
          label={t('location.add_modal.labels.streetAndNumber')}
          error={
            formState.errors.streetAndNumber &&
            t('location.add_modal.errors.streetAndNumber')
          }
        />
        <Inline spacing={5}>
          <FormElement
            Component={<Input {...register('zip')} disabled />}
            id="location-zip"
            label={t('location.add_modal.labels.zip')}
          />
          <FormElement
            Component={<Input {...register('municipalityName')} disabled />}
            id="location-municipality-name"
            label={t('location.add_modal.labels.municipality')}
          />
        </Inline>
        <Stack>
          <Text fontWeight="bold">{t('location.add_modal.labels.type')}</Text>
          <Paragraph marginBottom={3} variant={TextVariants.MUTED}>
            {t('location.add_modal.labels.typeInfo')}
          </Paragraph>
          {formState.errors.type?.id && (
            <Text color="red">{t('location.add_modal.errors.type')}</Text>
          )}
          <Inline spacing={3} flexWrap="wrap" maxWidth="70rem">
            {types.map(({ id, name, domain }) => (
              <Button
                width="auto"
                marginBottom={3}
                display="inline-flex"
                key={id}
                active={id === selectedType?.id}
                variant={ButtonVariants.SECONDARY}
                onClick={() => {
                  setValue('type', {
                    id,
                    label: name[i18n.language],
                    domain,
                  });
                  trigger('type');
                }}
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
