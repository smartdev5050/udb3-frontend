import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import {
  useChangeAudienceMutation,
  useGetEventByIdQuery,
} from '@/hooks/api/events';
import { ValidationStatus } from '@/pages/steps/AdditionalInformationStep/AdditionalInformationStep';
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
  audienceType: yup
    .mixed<AudienceType>()
    .oneOf(Object.values(AudienceType))
    .required(),
});

const AudienceStep = ({
  offerId,
  onSuccessfulChange,
  onValidationChange,
  ...props
}: Props) => {
  // TODO: refactor
  const eventId = offerId;

  const { t } = useTranslation();

  const { register, control, setValue } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const watchedAudienceType = useWatch({ control, name: 'audienceType' });

  const getEventByIdQuery = useGetEventByIdQuery({ id: offerId });

  // @ts-expect-error
  const event: Event | undefined = getEventByIdQuery.data;

  useEffect(() => {
    const newAudienceType =
      event?.audience?.audienceType ?? AudienceType.EVERYONE;
    setValue('audienceType', newAudienceType);

    onValidationChange(ValidationStatus.SUCCESS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.audience?.audienceType, setValue]);

  const addAudienceMutation = useChangeAudienceMutation({
    onSuccess: onSuccessfulChange,
  });

  const handleOnChangeAudience = async (audienceType: AudienceType) => {
    setValue('audienceType', audienceType);

    await addAudienceMutation.mutateAsync({
      eventId: offerId,
      audienceType,
    });
  };

  return (
    <Stack {...getStackProps(props)}>
      <Stack spacing={3} marginBottom={3}>
        <Text fontWeight="bold">
          {t('create.additionalInformation.audience.title')}
        </Text>
        {Object.values(AudienceType).map((type, index) => (
          <FormElement
            key={index}
            id={`audience-${type}`}
            Component={
              <RadioButtonWithLabel
                {...register(`audienceType`)}
                label={t(`create.additionalInformation.audience.${type}`)}
                checked={watchedAudienceType === type}
                onChange={() => handleOnChangeAudience(type)}
              />
            }
          />
        ))}
        {watchedAudienceType === AudienceType.EDUCATION && (
          <Text variant="muted" maxWidth="30%">
            {t('create.additionalInformation.audience.help')}
          </Text>
        )}
      </Stack>
    </Stack>
  );
};
export { AudienceStep };
