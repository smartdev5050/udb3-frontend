import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Controller, ControllerRenderProps, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { OfferType, OfferTypes } from '@/constants/OfferType';
import { parseSpacing } from '@/ui/Box';
import { CustomIcon, CustomIconVariants } from '@/ui/CustomIcon';
import { getInlineProps, Inline, InlineProps } from '@/ui/Inline';
import { getValueFromTheme } from '@/ui/theme';
import { ToggleBox } from '@/ui/ToggleBox';

import { Scope } from '../create/OfferForm';
import { FormDataUnion, StepProps, StepsConfiguration } from './Steps';

type Props = InlineProps & StepProps & { offerId?: string; scope?: Scope };

const getGlobalValue = getValueFromTheme('global');

const ScopeStep = ({
  offerId,
  control,
  name,
  setValue,
  resetField,
  scope,
  ...props
}: Props) => {
  const { t } = useTranslation();
  const { replace } = useRouter();

  useEffect(() => {
    setValue('scope', scope);
  }, [scope, setValue]);

  const handleChangeScope = (
    field: ControllerRenderProps<FormDataUnion, string & Path<FormDataUnion>>,
    scope: OfferType,
  ) => {
    field.onChange(scope);
    replace(`/create?scope=${scope}`, undefined, { shallow: true });
    resetFieldsAfterScopeChange();
  };

  const resetFieldsAfterScopeChange = () => {
    if (offerId) return;
    resetField('typeAndTheme');
    resetField('calendar');
    resetField('location');
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <Inline
            spacing={5}
            alignItems="stretch"
            maxWidth={parseSpacing(9)}
            {...getInlineProps(props)}
          >
            <ToggleBox
              onClick={() => handleChangeScope(field, OfferTypes.EVENTS)}
              active={field.value === OfferTypes.EVENTS}
              icon={
                <CustomIcon name={CustomIconVariants.BUILDING} width="80" />
              }
              text={t('steps.offerTypeStep.types.event')}
              width="30%"
              minHeight={parseSpacing(7)}
              disabled={!!offerId}
            />
            <ToggleBox
              onClick={() => handleChangeScope(field, OfferTypes.PLACES)}
              active={field.value === OfferTypes.PLACES}
              icon={<CustomIcon name={CustomIconVariants.MAP} width="70" />}
              text={t('steps.offerTypeStep.types.place')}
              width="30%"
              minHeight={parseSpacing(7)}
              disabled={!!offerId}
            />
          </Inline>
        );
      }}
    />
  );
};

const scopeStepConfiguration: StepsConfiguration<'scope'> = {
  Component: ScopeStep,
  name: 'scope',
  title: ({ t }) => t(`create.scope.title`),
  shouldShowStep: () => true,
};

export { scopeStepConfiguration };
