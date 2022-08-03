import { useTranslation } from 'react-i18next';

import { additionalInformationStepConfiguration } from '../steps/AdditionalInformationStep';
import { nameStepConfiguration } from '../steps/NameStep';
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
          media: t('create.toast.success.media'),
          booking_info: t('create.toast.success.booking_info'),
          contact_info: t('create.toast.success.contact_info'),
          description: t('create.toast.success.description'),
          audience: t('create.toast.success.audience'),
          price_info: t('create.toast.success.price_info'),
          organizer: t('create.toast.success.organizer'),
        },
        title: '',
      }}
      configuration={[
        // @ts-expect-error
        typeStepConfiguration,
        // @ts-expect-error
        nameStepConfiguration,
        additionalInformationStepConfiguration,
      ]}
    />
  );
};

export { EventForm };
