import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertVariants } from '../publiq-ui/Alert';
import { RadioButtonGroup } from '../publiq-ui/RadioButtonGroup';
import { getStackProps, Stack } from '../publiq-ui/Stack';
import { Text } from '../publiq-ui/Text';
import { TextAreaWithLabel } from '../publiq-ui/TextAreaWithLabel';
import { getValueFromTheme } from '../publiq-ui/theme';
import { MaxLengthReason, OfferStatus } from './constants';

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
        label: t(`offerStatus.status.${offerType}.available`),
        value: OfferStatus.AVAILABLE,
      },
      {
        label: t(`offerStatus.status.${offerType}.temporarilyUnavailable`),
        value: OfferStatus.TEMPORARILY_UNAVAILABLE,
        info: t(`offerStatus.status.${offerType}.temporarilyUnavailableInfo`),
      },
      {
        label: t(`offerStatus.status.${offerType}.unavailable`),
        value: OfferStatus.UNAVAILABLE,
        info: t(`offerStatus.status.${offerType}.unavailableInfo`),
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
