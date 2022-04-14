import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Button, ButtonVariants } from '@/ui/Button';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { Select } from '@/ui/Select';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';

const ContactInfoType = {
  PHONE: 'phone',
  EMAIL: 'email',
  URL: 'url',
} as const;

type Props = {};

const schema = yup
  .object()
  .shape({
    contactPoints: yup.array().of(
      yup.object({
        contactInfoType: yup.string(),
        contactInfo: yup.string(),
      }),
    ),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const ContactInfo = ({}: Props) => {
  const { t } = useTranslation();

  const {
    register,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const watchedContactPoints = watch('contactPoints') ?? [];

  const handleAddContactPoint = () => {
    setValue('contactPoints', [
      ...watchedContactPoints,
      {
        contactInfoType: ContactInfoType.PHONE,
        contactInfo: '',
      },
    ]);
  };

  return (
    <Stack>
      <Inline spacing={3} marginBottom={3}>
        <Text fontWeight="bold">
          {t('create.additionalInformation.contact_info.title')}
        </Text>
        <Button
          onClick={handleAddContactPoint}
          variant={ButtonVariants.SECONDARY}
        >
          {t('create.additionalInformation.contact_info.add')}
        </Button>
      </Inline>
      <Stack spacing={3}>
        {watchedContactPoints.map((contactPoint, index) => (
          <Inline key={index} spacing={5}>
            <Select {...register(`contactPoint.${index}.contactInfoType`)}>
              {Object.keys(ContactInfoType).map((key, index) => (
                <option key={index} value={ContactInfoType[key]}>
                  {t(
                    `create.additionalInformation.contact_info.${ContactInfoType[key]}`,
                  )}
                </option>
              ))}
            </Select>
            <Input {...register(`contactPoint.${index}.contactInfo`)} />
          </Inline>
        ))}
      </Stack>
    </Stack>
  );
};
export { ContactInfo };
