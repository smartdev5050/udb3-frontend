import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, ButtonVariants } from '@/ui/Button';
import { Inline } from '@/ui/Inline';
import { Link, LinkVariants } from '@/ui/Link';
import { Page } from '@/ui/Page';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { Toast } from '@/ui/Toast';

import { useToast } from '../manage/movies/useToast';
import { useAddEvent } from './hooks/useAddEvent';
import { useEditField } from './hooks/useEditField';
import { FooterStatus, useFooterStatus } from './hooks/useFooterStatus';
import { useGetEvent } from './hooks/useGetEvent';
import { useParseStepConfiguration } from './hooks/useParseStepConfiguration';
import { usePublishEvent } from './hooks/usePublishEvent';
import { PublishLaterModal } from './modals/PublishLaterModal';
import { FormDataUnion, Steps, StepsConfiguration } from './Steps';

const getValue = getValueFromTheme('createPage');

type StepsFormProps<TFormData extends FormDataUnion> = {
  configurations: Array<StepsConfiguration<TFormData>>;
  convertFormDataToEvent: (data: any) => any;
  convertEventToFormData: (event: any) => any;
  toastConfiguration: any;
  title: string;
  label?: string;
};

const StepsForm = <TFormData extends FormDataUnion>({
  configurations,
  convertFormDataToEvent,
  convertEventToFormData,
  toastConfiguration,
  title,
  label,
}: StepsFormProps<TFormData>) => {
  const { t } = useTranslation();
  const { form } = useParseStepConfiguration<TFormData>(configurations);

  const { handleSubmit, reset } = form;

  const router = useRouter();

  // eventId is set after adding (saving) the event
  // or when entering the page from the edit route
  const [eventId, setEventId] = useState(
    (router.query.eventId as string) ?? '',
  );

  const toast = useToast(toastConfiguration);

  const publishEvent = usePublishEvent({
    id: eventId,
    onSuccess: () => {
      router.push(`/event/${eventId}/preview`);
    },
  });

  const addEvent = useAddEvent({
    onSuccess: setEventId,
    convertFormDataToEvent,
    label,
  });

  const handleChangeSuccess = (editedField: string) =>
    toast.trigger(editedField);

  const { handleChange, fieldLoading } = useEditField<TFormData>({
    eventId,
    handleSubmit,
    onSuccess: handleChangeSuccess,
  });

  const [isPublishLaterModalVisible, setIsPublishLaterModalVisible] = useState(
    false,
  );

  const event = useGetEvent({
    id: eventId,
    onSuccess: (event: Event) => {
      reset(convertEventToFormData(event), {
        keepDirty: true,
      });
    },
  });

  const footerStatus = useFooterStatus({ event, form });

  return (
    <Page>
      <Page.Title spacing={3} alignItems="center">
        {title ?? ''}
      </Page.Title>

      <Page.Content spacing={5} alignItems="flex-start">
        <Toast
          variant="success"
          header={toast.header}
          body={toast.message}
          visible={!!toast.message}
          onClose={() => toast.clear()}
        />
        <Steps<TFormData>
          configurations={configurations}
          onChange={handleChange}
          fieldLoading={fieldLoading}
          onChangeSuccess={handleChangeSuccess}
          eventId={eventId}
          form={form}
        />
      </Page.Content>
      {footerStatus !== FooterStatus.HIDDEN && (
        <Page.Footer>
          <Inline spacing={3} alignItems="center">
            {footerStatus === FooterStatus.PUBLISH ? (
              [
                <Button
                  variant={ButtonVariants.SUCCESS}
                  onClick={async () => publishEvent()}
                  key="publish"
                >
                  {t('movies.create.actions.publish')}
                </Button>,
                <Button
                  variant={ButtonVariants.SECONDARY}
                  onClick={() => setIsPublishLaterModalVisible(true)}
                  key="publishLater"
                >
                  {t('movies.create.actions.publish_later')}
                </Button>,
                <Text
                  key="info"
                  color={getValue('footer.color')}
                  fontSize="0.9rem"
                >
                  {t('movies.create.footer.auto_save')}
                </Text>,
              ]
            ) : footerStatus === FooterStatus.MANUAL_SAVE ? (
              <Button onClick={handleSubmit(addEvent)}>
                {t('movies.create.actions.save')}
              </Button>
            ) : (
              <Inline spacing={3} alignItems="center">
                <Link
                  href={`/event/${eventId}/preview`}
                  variant={LinkVariants.BUTTON_SUCCESS}
                >
                  <Text>{t('movies.create.footer.done_editing')}</Text>
                </Link>
                <Text color={getValue('footer.color')} fontSize="0.9rem">
                  {t('movies.create.footer.auto_save')}
                </Text>
              </Inline>
            )}
          </Inline>
          <PublishLaterModal
            visible={isPublishLaterModalVisible}
            onConfirm={publishEvent}
            onClose={() => setIsPublishLaterModalVisible(false)}
          />
        </Page.Footer>
      )}
    </Page>
  );
};

export { StepsForm };
