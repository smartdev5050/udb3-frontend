import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import type { Calendar } from '@/hooks/api/events';
import type { StepsConfiguration } from '@/pages/steps/Steps';
import { Steps } from '@/pages/steps/Steps';
import { Page } from '@/ui/Page';

import { additionalInformationStepConfiguration } from '../steps/AdditionalInformationStep';
type EventType = 'event' | 'place';

type FormData = {
  type: EventType;
  theme: string;
  calendar: Calendar;
};

const schema = yup
  .object({
    type: yup.mixed<EventType>().required().oneOf(['event', 'place']),
    theme: yup.string().required(),
    calendar: yup.mixed().required(),
  })
  .required();

const EventForm = () => {
  const router = useRouter();
  const { eventId } = router.query;

  const { t } = useTranslation();

  const form = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const configuration: StepsConfiguration<FormData> = useMemo(() => {
    return [
      {
        ...additionalInformationStepConfiguration,
        stepProps: {
          ...(eventId && { eventId }),
        },
      },
    ];
  }, [eventId]);

  return (
    <Page>
      <Page.Title>{t(`event.create.title`)}</Page.Title>
      <Page.Content spacing={5}>
        <Steps configuration={configuration} form={form} />
      </Page.Content>
    </Page>
  );
};

export { EventForm };
export type { FormData };
