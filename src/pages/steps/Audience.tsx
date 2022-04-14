import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { useAddAudienceMutation } from '@/hooks/api/events';
import { Values } from '@/types/Values';
import { FormElement } from '@/ui/FormElement';
import { Inline } from '@/ui/Inline';
import { RadioButton } from '@/ui/RadioButton';
import { RadioButtonWithLabel } from '@/ui/RadioButtonWithLabel';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text } from '@/ui/Text';

type Props = StackProps & {
  eventId: string;
  selectedAudience?: string;
};

const AudienceType = {
  EVERYONE: 'everyone',
  MEMBERS: 'members',
  EDUCATION: 'education',
} as const;

type AudienceType = Values<typeof AudienceType>;

type FormData = { audienceType: string };

const schema = yup.object({
  audienceType: yup.string().required(),
});

const Audience = ({ eventId, selectedAudience, ...props }: Props) => {
  const { t, i18n } = useTranslation();
  const formComponent = useRef<HTMLFormElement>();

  const {
    register,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue('audienceType', selectedAudience ?? AudienceType.EVERYONE);
  }, [selectedAudience, setValue]);

  const addAudienceMutation = useAddAudienceMutation({
    onSuccess: async () => {
      console.log('added audience');
    },
  });

  const handleOnChangeAudience = async (audienceType: AudienceType) => {
    setValue('audienceType', audienceType);

    await addAudienceMutation.mutateAsync({
      eventId,
      audienceType,
    });
  };

  const wactchedAudienceType = watch('audienceType');

  return (
    <Stack {...getStackProps(props)}>
      <Stack spacing={3} marginBottom={3}>
        <Text fontWeight="bold">Toegang</Text>
        {Object.keys(AudienceType).map((key, index) => (
          <FormElement
            key={index}
            id={`audience-${AudienceType[key]}`}
            Component={
              <RadioButtonWithLabel
                {...register(AudienceType[key])}
                label={t(
                  `create.additionalInformation.audience.${AudienceType[key]}`,
                )}
                value={AudienceType[key]}
                checked={wactchedAudienceType === AudienceType[key]}
                onChange={() => handleOnChangeAudience(AudienceType[key])}
              />
            }
          />
        ))}
      </Stack>
    </Stack>
  );
};
export { Audience };
