import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Button, ButtonVariants } from '@/ui/Button';
import { Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { Select } from '@/ui/Select';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

const ContactInfoType = {
  PHONE: 'phone',
  EMAIL: 'email',
  URL: 'url',
} as const;

type Props = {};

const getValue = getValueFromTheme('contactInformation');

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

  const handleDeleteContactPoint = (id: number): void => {
    setValue('contactPoints', [
      ...watchedContactPoints.filter((_contactPoint, index) => id !== index),
    ]);
  };

  return (
    <Stack>
      <Inline spacing={3} marginBottom={3}>
        <Text fontWeight="bold">
          {t('create.additionalInformation.contact_info.title')}
        </Text>
        {watchedContactPoints.length === 0 && (
          <Button
            onClick={handleAddContactPoint}
            variant={ButtonVariants.SECONDARY}
          >
            {t('create.additionalInformation.contact_info.add')}
          </Button>
        )}
      </Inline>
      {watchedContactPoints.length > 0 && (
        <Stack
          spacing={3}
          css={`
            border: 1px solid ${getValue('borderColor')};
          `}
        >
          {watchedContactPoints.map((contactPoint, index) => (
            <Inline
              padding={3}
              key={index}
              css={
                index !== 0 &&
                `
              border-top: 1px solid ${getValue('borderColor')};
            `
              }
              spacing={5}
            >
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
              <Button
                onClick={() => handleDeleteContactPoint(index)}
                variant={ButtonVariants.DANGER}
                iconName={Icons.TRASH}
              ></Button>
            </Inline>
          ))}
          <Inline
            padding={3}
            css={`
              border-top: 1px solid ${getValue('borderColor')};
            `}
          >
            <Button
              variant={ButtonVariants.LINK}
              onClick={handleAddContactPoint}
            >
              {t('create.additionalInformation.contact_info.add_more')}
            </Button>
          </Inline>
        </Stack>
      )}
    </Stack>
  );
};
export { ContactInfo };
