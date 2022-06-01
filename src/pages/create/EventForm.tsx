import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import type { Calendar } from '@/hooks/api/events';
import type { StepsConfiguration } from '@/pages/Steps';
import { Steps } from '@/pages/Steps';
import { Page } from '@/ui/Page';
import { Toast } from '@/ui/Toast';

import { useToast } from '../manage/movies/useToast';
import { AdditionalInformationStep } from '../steps/AdditionalInformationStep';
import { CalendarStep } from './CalendarStep';
import { ThemeStep } from './ThemeStep';
import { TypeStep } from './TypeStep';

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

  const toast = useToast({
    messages: {
      audience: t('create.toast.success.audienceType'),
      bookingInfo: t('create.toast.success.bookingInfo'),
      contactInfo: t('create.toast.success.contactInfo'),
    },
    title: 'event.create.title',
  });

  const handleChangeSuccess = (editedField: string) => {
    toast.trigger(editedField);
  };

  const configuration: StepsConfiguration<FormData> = useMemo(() => {
    return [
      {
        Component: TypeStep,
        field: 'type',
        title: t(`event.create.type.title`),
      },
      {
        Component: ThemeStep,
        field: 'theme',
        title: t(`event.create.theme.title`),
      },
      {
        Component: CalendarStep,
        field: 'calendar',
        title: t(`event.create.calendar.title`),
      },
      {
        Component: AdditionalInformationStep,
        title: t(`event.create.additionalInformation.title`),
        stepProps: {
          ...(eventId && { eventId }),
        },
      },
    ];
  }, [t]);

  return (
    <Page>
      <Page.Title>{t(`event.create.title`)}</Page.Title>
      <Page.Content spacing={5}>
        <Toast
          variant="success"
          header={toast.header}
          body={toast.message}
          visible={!!toast.message}
          onClose={() => toast.clear()}
        />
        <Steps
          configuration={configuration}
          form={form}
          onChangeSuccess={handleChangeSuccess}
        />
      </Page.Content>
    </Page>
  );
};

export { EventForm };
export type { FormData };
