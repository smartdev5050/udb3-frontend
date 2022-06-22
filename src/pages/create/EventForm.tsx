import { useTranslation } from 'react-i18next';

import { additionalInformationStepConfiguration } from '../steps/AdditionalInformationStep';
import { StepsForm } from '../steps/StepsForm';

const EventForm = () => {
  const { t } = useTranslation();

  return (
    <StepsForm
      convertFormDataToEvent={() => {}}
      convertEventToFormData={() => {}}
      title={t(`event.create.title`)}
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
