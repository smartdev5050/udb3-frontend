import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { OfferType } from '@/constants/OfferType';
import type { StepProps } from '@/pages/Steps';
import { Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { ToggleBox } from '@/ui/ToggleBox';

const TypeStep = ({ control, field }: StepProps<FormData>) => {
  const { t } = useTranslation();

  return (
    <Controller
      control={control}
      name={field}
      render={({ field }) => {
        return (
          <Inline
            spacing={5}
            alignItems="center"
            justifyContent="space-between"
          >
            <ToggleBox
              onClick={() => field.onChange(OfferType.EVENT)}
              active={field.value === OfferType.EVENT}
              icon={Icons.CALENDAR_ALT}
              text={t('offerTypes.event')}
            />
            <span css="font-style: italic;">{t('steps.offerTypeStep.or')}</span>
            <ToggleBox
              onClick={() => field.onChange(OfferType.PLACE)}
              active={field.value === OfferType.PLACE}
              icon={Icons.BUILDING}
              text={t('offerTypes.place')}
            />
          </Inline>
        );
      }}
    />
  );
};

export { TypeStep };
