import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { OfferType } from '@/constants/OfferType';
import { parseSpacing } from '@/ui/Box';
import { Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Text } from '@/ui/Text';
import { ToggleBox } from '@/ui/ToggleBox';

import { FormDataIntersection, StepProps } from './Steps';

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
              onClick={() => field.onChange(OfferType.EVENTS)}
              active={field.value === OfferType.EVENTS}
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
              onClick={() => field.onChange(OfferType.PLACES)}
              active={field.value === OfferType.PLACES}
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

const typeStepConfiguration = {
  Component: TypeStep,
  field: 'type',
  title: (t) => t(`event.create.type.title`),
};

export { TypeStep, typeStepConfiguration };
