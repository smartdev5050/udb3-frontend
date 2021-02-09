import { useRouter } from 'next/router';
import { QueryStatus } from '../../../hooks/api/authenticated-query';
import { useEffect, useState } from 'react';
import { getApplicationServerSideProps } from '../../../utils/getApplicationServerSideProps';
import { Alert, AlertVariants } from '../../../components/publiq-ui/Alert';
import { Button, ButtonVariants } from '../../../components/publiq-ui/Button';
import { Spinner } from '../../../components/publiq-ui/Spinner';
import { RadioButtonGroup } from '../../../components/publiq-ui/RadioButtonGroup';
import { Page } from '../../../components/publiq-ui/Page';
import { TextAreaWithLabel } from '../../../components/publiq-ui/TextAreaWithLabel';
import { useTranslation } from 'react-i18next';
import { useChangeStatus, useGetPlaceById } from '../../../hooks/api/places';
import { Text } from '../../../components/publiq-ui/Text';
import { getValueFromTheme } from '../../../components/publiq-ui/theme';
import { Stack } from '../../../components/publiq-ui/Stack';
import { Inline } from '../../../components/publiq-ui/Inline';

const getValue = getValueFromTheme('statusPage');

const OfferStatus = {
  AVAILABLE: 'Available',
  TEMPORARILY_UNAVAILABLE: 'TemporarilyUnavailable',
  UNAVAILABLE: 'Unavailable',
};

const maxLengthReason = 200;

const Status = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { placeId } = router.query;

  const [errorMessage, setErrorMessage] = useState();
  const [type, setType] = useState('');
  const [reason, setReason] = useState('');

  const handleError = (error) => setErrorMessage(error.message);
  const { data: place = {}, status: queryStatus } = useGetPlaceById(
    { id: placeId },
    { onError: handleError },
  );
  const handleSuccessChangeStatus = () => {
    router.push(`/place/${placeId}/preview`);
  };
  const { mutate: changeStatus } = useChangeStatus({
    onSuccess: handleSuccessChangeStatus,
    onError: handleError,
  });

  const name = place.name?.[i18n.language] ?? place.name?.[place.mainLanguage];
  const rawStatusType = place?.status?.type;
  const rawStatusReason = place?.status?.reason;

  useEffect(() => {
    if (!rawStatusType) return;
    setType(rawStatusType);
  }, [rawStatusType]);

  useEffect(() => {
    const newReason = place.status?.reason?.[i18n.language];
    if (!rawStatusReason || !newReason) return;
    setReason(newReason);
  }, [rawStatusReason]);

  return (
    <Page>
      <Page.Title>{t('offerStatus.title', { name })}</Page.Title>
      <Page.Content spacing={5}>
        {queryStatus === QueryStatus.LOADING ? (
          <Spinner marginTop={4} />
        ) : errorMessage ? (
          <Alert variant={AlertVariants.WARNING}>{errorMessage}</Alert>
        ) : (
          [
            <RadioButtonGroup
              key="placeStatus"
              groupLabel={t('offerStatus.newStatus')}
              name="placeStatus"
              items={[
                {
                  label: t('offerStatus.status.open'),
                  value: OfferStatus.AVAILABLE,
                },
                {
                  label: t('offerStatus.status.temporarilyClosed'),
                  value: OfferStatus.TEMPORARILY_UNAVAILABLE,
                  info: t('offerStatus.status.temporarilyClosedInfo'),
                },
                {
                  label: t('offerStatus.status.permanentlyClosed'),
                  value: OfferStatus.UNAVAILABLE,
                  info: t('offerStatus.status.permanentlyClosedInfo'),
                },
              ]}
              selected={type}
              onChange={(e) => setType(e.target.value)}
            />,
            <Stack key="reason" spacing={2}>
              <Stack spacing={3}>
                <TextAreaWithLabel
                  id="reason"
                  label={t('offerStatus.reason')}
                  value={reason}
                  onInput={(e) => setReason(e.target.value)}
                />
                {reason.length > maxLengthReason && (
                  <Alert variant={AlertVariants.WARNING}>
                    {t('offerStatus.maxLengthReason', {
                      amount: maxLengthReason,
                    })}
                  </Alert>
                )}
              </Stack>
              <Text color={getValue('infoTextColor')}>
                {t('offerStatus.reasonTip')}
              </Text>
            </Stack>,
            <Inline key="actions" spacing={3}>
              <Button
                variant={ButtonVariants.SECONDARY}
                onClick={() => router.push(`/place/${placeId}/preview`)}
              >
                {t('offerStatus.actions.cancel')}
              </Button>
              <Button
                variant={ButtonVariants.PRIMARY}
                disabled={reason.length > maxLengthReason}
                onClick={() => {
                  changeStatus({
                    id: placeId,
                    type,
                    reason: {
                      ...place.status.reason,
                      [i18n.language]: reason,
                    },
                  });
                }}
              >
                {t('offerStatus.actions.save')}
              </Button>
            </Inline>,
          ]
        )}
      </Page.Content>
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export default Status;
