import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertVariants } from '../publiq-ui/Alert';
import { RadioButtonGroup } from '../publiq-ui/RadioButtonGroup';
import { getStackProps, Stack } from '../publiq-ui/Stack';
import { Text } from '../publiq-ui/Text';
import { TextAreaWithLabel } from '../publiq-ui/TextAreaWithLabel';
import { getValueFromTheme } from '../publiq-ui/theme';
import { MaxLengthReason, OfferStatus, OfferType } from './constants';

const getValue = getValueFromTheme('statusPage');

const ReasonAndTypeForm = ({
  offerType,
  statusType,
  statusReason,
  onChangeStatusType,
  onInputStatusReason,
  ...props
}) => {
  const { t } = useTranslation();

  const radioButtonItems = useMemo(
    () => [
      {
        label:
          offerType === OfferType.PLACE
            ? t('offerStatus.status.open')
            : t('offerStatus.status.scheduled'),
        value: OfferStatus.AVAILABLE,
      },
      {
        label:
          offerType === OfferType.PLACE
            ? t('offerStatus.status.temporarilyClosed')
            : t('offerStatus.status.postponed'),
        value: OfferStatus.TEMPORARILY_UNAVAILABLE,
        info:
          offerType === OfferType.PLACE
            ? t('offerStatus.status.temporarilyClosedInfo')
            : t('offerStatus.status.postponedInfo'),
      },
      {
        label:
          offerType === OfferType.PLACE
            ? t('offerStatus.status.permanentlyClosed')
            : t('offerStatus.status.cancelled'),
        value: OfferStatus.UNAVAILABLE,
        info:
          offerType === OfferType.PLACE
            ? t('offerStatus.status.permanentlyClosedInfo')
            : t('offerStatus.status.cancelledInfo'),
      },
    ],
    [offerType],
  );

  return (
    <Stack spacing={5} {...getStackProps(props)}>
      <RadioButtonGroup
        key="offerStatus"
        groupLabel={t('offerStatus.newStatus')}
        name="offerStatus"
        items={radioButtonItems}
        selected={statusType}
        onChange={onChangeStatusType}
      />
      <Stack key="reason" spacing={2}>
        <Stack spacing={3}>
          <TextAreaWithLabel
            id="reason"
            label={t('offerStatus.reason')}
            value={statusReason}
            onInput={onInputStatusReason}
            disabled={statusType === OfferStatus.AVAILABLE}
          />
          {statusReason.length > MaxLengthReason && (
            <Alert variant={AlertVariants.WARNING}>
              {t('offerStatus.maxLengthReason', {
                amount: MaxLengthReason,
              })}
            </Alert>
          )}
        </Stack>
        <Text color={getValue('infoTextColor')}>
          {t('offerStatus.reasonTip')}
        </Text>
      </Stack>
    </Stack>
  );
};

ReasonAndTypeForm.propTypes = {
  offerType: PropTypes.string,
  statusType: PropTypes.string,
  statusReason: PropTypes.string,
  onChangeStatusType: PropTypes.func,
  onInputStatusReason: PropTypes.func,
};

export { ReasonAndTypeForm };
