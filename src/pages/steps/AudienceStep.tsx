import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import {
  useAddAudienceMutation,
  useGetEventByIdQuery,
} from '@/hooks/api/events';
import { Event } from '@/types/Event';
import { Values } from '@/types/Values';
import { FormElement } from '@/ui/FormElement';
import { RadioButtonWithLabel } from '@/ui/RadioButtonWithLabel';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text } from '@/ui/Text';

import { TabContentProps } from './AdditionalInformationStep';

type Props = StackProps & TabContentProps;

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

const Audience = ({
  eventId,
  onSuccessfulChange,
  onChangeCompleted,
  ...props
}: Props) => {
  const { t } = useTranslation();

  const { register, watch, setValue } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const getEventByIdQuery = useGetEventByIdQuery({ id: eventId });

  // @ts-expect-error
  const event: Event | undefined = getEventByIdQuery.data;

  useEffect(() => {
    if (!event?.audience?.audienceType) {
      setValue('audienceType', AudienceType.EVERYONE);
    } else {
      const newAudienceType = event.audience.audienceType;
      setValue('audienceType', newAudienceType);
    }

    onChangeCompleted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.audience?.audienceType, setValue]);

  const addAudienceMutation = useAddAudienceMutation({
    onSuccess: onSuccessfulChange,
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
        <Text fontWeight="bold">
          {t('create.additionalInformation.audience.title')}
        </Text>
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
