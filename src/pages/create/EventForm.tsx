import { useTranslation } from 'react-i18next';

import { additionalInformationStepConfiguration } from '../steps/AdditionalInformationStep';
import { StepsForm } from '../steps/StepsForm';
import { typeStepConfiguration } from '../steps/TypeStep';

const EventForm = () => {
  const { t } = useTranslation();

  return (
    <StepsForm
      title={t(`event.create.title`)}
      convertFormDataToEvent={(data) => data}
      convertEventToFormData={(data) => data}
      toastConfiguration={{
        messages: {
          image: t('movies.create.toast.success.image'),
          bookingInfo: t('create.toast.success.booking_info'),
          contactPoint: t('create.toast.success.contact_point'),
          description: t('movies.create.toast.success.description'),
          video: t('movies.create.toast.success.video'),
          audience: t('create.toast.success.audienceType'),
          priceInfo: t('create.toast.success.priceInfo'),
          organizer: t('create.toast.success.organizer'),
        },
        title: '',
      }}
      configuration={[
        // @ts-expect-error
        typeStepConfiguration,
        additionalInformationStepConfiguration,
      ]}
    />
  );
};

export { EventForm };
