import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { OfferType } from '@/constants/OfferType';
import { Offer } from '@/types/Offer';
import { Button, ButtonVariants } from '@/ui/Button';
import { Inline } from '@/ui/Inline';
import { Link, LinkVariants } from '@/ui/Link';
import { Page } from '@/ui/Page';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { Toast } from '@/ui/Toast';

import { useToast } from '../manage/movies/useToast';
import { useAddOffer } from './hooks/useAddOffer';
import { useEditField } from './hooks/useEditField';
import { FooterStatus, useFooterStatus } from './hooks/useFooterStatus';
import { useGetEvent } from './hooks/useGetEvent';
import { useGetPlace } from './hooks/useGetPlace';
import { useParseStepConfiguration } from './hooks/useParseStepConfiguration';
import { usePublishOffer } from './hooks/usePublishOffer';
import { PublishLaterModal } from './modals/PublishLaterModal';
import { Steps, StepsConfiguration } from './Steps';

const getValue = getValueFromTheme('createPage');

type StepsFormProps = {
  configurations: Array<StepsConfiguration>;
  convertFormDataToOffer: (data: any) => any;
  convertOfferToFormData: (event: any) => any;
  toastConfiguration: any;
  title: string;
  label?: string;
};

const StepsForm = ({
  configurations,
  convertFormDataToOffer,
  convertOfferToFormData,
  toastConfiguration,
  title,
  label,
}: StepsFormProps) => {
  const { t } = useTranslation();
  const { form } = useParseStepConfiguration(configurations);

  const { handleSubmit, reset } = form;

  const { query, push } = useRouter();

  // eventId is set after adding (saving) the event
  // or when entering the page from the edit route
  const [offerId, setOfferId] = useState(
    ((query.eventId as string) || (query.placeId as string)) ?? '',
  );

  const toast = useToast(toastConfiguration);

  const publishEvent = usePublishOffer({
    scope,
    id: query.eventId,
    onSuccess: () => {
      push(`/event/${query.eventId}/preview`);
    },
  });

  const addOffer = useAddOffer({
    onSuccess: (scope, offerId) => {
      push(`/${scope}/${offerId}/edit`, undefined, { shallow: true });
      setOfferId(offerId);
    },
    convertFormDataToOffer,
    label,
  });

  const handleChangeSuccess = (editedField: string) =>
    toast.trigger(editedField);

  const { handleChange, fieldLoading } = useEditField({
    scope,
    offerId,
    handleSubmit,
    onSuccess: handleChangeSuccess,
  });

  const [isPublishLaterModalVisible, setIsPublishLaterModalVisible] =
    useState(false);

  const useGetOffer = scope === OfferType.EVENTS ? useGetEvent : useGetPlace;

  const offer = useGetOffer({
    id: offerId,
    onSuccess: (offer: Offer) => {
      reset(convertOfferToFormData(offer), {
        keepDirty: true,
      });
    },
    enabled: !!scope,
  });

  const footerStatus = useFooterStatus({ offer, form });

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
        <Steps
          configurations={configurations}
          onChange={handleChange}
          fieldLoading={fieldLoading}
          onChangeSuccess={handleChangeSuccess}
          offerId={offerId}
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
                  {t('create.actions.publish')}
                </Button>,
                <Button
                  variant={ButtonVariants.SECONDARY}
                  onClick={() => setIsPublishLaterModalVisible(true)}
                  key="publishLater"
                >
                  {t('create.actions.publish_later')}
                </Button>,
                <Text
                  key="info"
                  color={getValue('footer.color')}
                  fontSize="0.9rem"
                >
                  {t('create.footer.auto_save')}
                </Text>,
              ]
            ) : footerStatus === FooterStatus.MANUAL_SAVE ? (
              <Button onClick={handleSubmit(addOffer)}>
                {t('create.actions.save')}
              </Button>
            ) : (
              <Inline spacing={3} alignItems="center">
                <Link
                  href={`/event/${offerId}/preview`}
                  variant={LinkVariants.BUTTON_SUCCESS}
                >
                  <Text>{t('create.footer.done_editing')}</Text>
                </Link>
                <Text color={getValue('footer.color')} fontSize="0.9rem">
                  {t('create.footer.auto_save')}
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
