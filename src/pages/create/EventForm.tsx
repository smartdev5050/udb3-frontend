import { useTranslation } from 'react-i18next';

import { additionalInformationStepConfiguration } from '../steps/AdditionalInformationStep';
import { StepsForm } from '../steps/StepsForm';

const EventForm = () => {
  const { t } = useTranslation();

  return (
    <StepsForm
      title={t(`event.create.title`)}
      convertFormDataToEvent={(data) => data}
      convertEventToFormData={(data) => data}
      toastConfiguration={{
        messages: {
          audience: t('create.toast.success.audienceType'),
          organizer: t('create.toast.success.organizer'),
        },
        title: '',
      }}
      configuration={[additionalInformationStepConfiguration]}
    />
  );
};

export { EventForm };
