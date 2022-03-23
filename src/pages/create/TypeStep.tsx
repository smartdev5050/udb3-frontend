import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { OfferType } from '@/constants/OfferType';
import type { FormDataIntersection, StepProps } from '@/pages/Steps';
import { parseSpacing } from '@/ui/Box';
import { Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Text } from '@/ui/Text';
import { ToggleBox } from '@/ui/ToggleBox';

const TypeStep = <TFormData extends FormDataIntersection>({
  control,
  field,
}: StepProps<TFormData>) => {
  const { t } = useTranslation();

  return (
    <Controller<TFormData>
      control={control}
      name={field}
      render={({ field }) => {
        return (
          <Inline spacing={5} alignItems="center" maxWidth={parseSpacing(11)}>
            <ToggleBox
              onClick={() => field.onChange(OfferType.EVENT)}
              active={field.value === OfferType.EVENT}
              icon={Icons.CALENDAR_ALT}
              text={t('steps.offerTypeStep.types.event')}
              width="30%"
              minHeight={parseSpacing(7)}
            />
            <Text
              display={{
                default: 'block',
                m: 'none',
              }}
              fontStyle="italic"
            >
              {t('steps.offerTypeStep.or')}
            </Text>
            <ToggleBox
              onClick={() => field.onChange(OfferType.PLACE)}
              active={field.value === OfferType.PLACE}
              icon={Icons.BUILDING}
              text={t('steps.offerTypeStep.types.place')}
              width="30%"
              minHeight={parseSpacing(7)}
            />
          </Inline>
        );
      }}
    />
  );
};

export { TypeStep };
