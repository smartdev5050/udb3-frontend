import { yupResolver } from '@hookform/resolvers/yup';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Values } from '@/types/Values';
import { FormElement } from '@/ui/FormElement';
import { Inline } from '@/ui/Inline';
import { RadioButton } from '@/ui/RadioButton';
import { RadioButtonWithLabel } from '@/ui/RadioButtonWithLabel';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text } from '@/ui/Text';

type Props = StackProps;

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

const Audience = ({ ...props }: Props) => {
  const { t, i18n } = useTranslation();
  const formComponent = useRef<HTMLFormElement>();

  const {
    register,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<any>({
    resolver: yupResolver(schema),
  });
  const handleOnChangeAudience = (audienceType: AudienceType) => {
    setValue('audienceType', audienceType);
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
                label={AudienceType[key]}
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
