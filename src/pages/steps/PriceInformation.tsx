import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { parseSpacing } from '@/ui/Box';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

import { Rate } from './modals/PriceInfoModal';

const getValue = getValueFromTheme('priceInformation');

type Props = {
  priceInfo: Rate[];
  onClickAddPriceInfo: () => void;
  onClickAddFreePriceInfo: () => void;
};

const PriceInformation = ({
  priceInfo,
  onClickAddPriceInfo,
  onClickAddFreePriceInfo,
}: Props) => {
  const { t, i18n } = useTranslation();

  const hasPriceInfo = useMemo(() => {
    return priceInfo.length > 0;
  }, [priceInfo]);

  return (
    <Stack>
      <Inline spacing={3} marginBottom={3}>
        <Text fontWeight="bold">
          {t('create.additionalInformation.price_info.price')}
        </Text>
        {hasPriceInfo && <Icon color="green" name={Icons.CHECK_CIRCLE} />}
      </Inline>
      {hasPriceInfo && (
        <Inline justifyContent="space-between" paddingTop={3} paddingBottom={3}>
          <Text>{t('create.additionalInformation.price_info.prices')}</Text>
          <Button
            // () => setIsPriceInfoModalVisible(true)
            onClick={onClickAddPriceInfo}
            variant={ButtonVariants.SECONDARY}
          >
            {t('create.additionalInformation.price_info.change')}
          </Button>
        </Inline>
      )}
      {priceInfo.map((rate: Rate, index) => (
        <Inline
          key={index}
          justifyContent="space-between"
          paddingTop={3}
          paddingBottom={3}
          css={`
            border-top: 1px solid ${getValue('borderColor')};
          `}
        >
          <Text>{rate.name[i18n.language]}</Text>
          <Text>
            {rate.price === '0,00'
              ? t('create.additionalInformation.price_info.free')
              : `${rate.price} ${t(
                  'create.additionalInformation.price_info.euro',
                )}`}
          </Text>
        </Inline>
      ))}
      {!hasPriceInfo && (
        <Inline spacing={3} alignItems="center">
          <Button
            onClick={onClickAddPriceInfo}
            variant={ButtonVariants.SECONDARY}
          >
            {t('create.additionalInformation.price_info.title')}
          </Button>
          <Button
            variant={ButtonVariants.LINK}
            onClick={onClickAddFreePriceInfo}
          >
            {t('create.additionalInformation.price_info.free')}
          </Button>
        </Inline>
      )}
    </Stack>
  );
};
export { PriceInformation };
