import debounce from 'lodash/debounce';
import { useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import {
  useChangeNameMutation,
  useGetEventByIdQuery,
} from '@/hooks/api/events';
import { useGetProductionsQuery } from '@/hooks/api/productions';
import {
  useAddEventByIdMutation as useAddEventToProductionByIdMutation,
  useCreateWithEventsMutation as useCreateProductionWithEventsMutation,
  useDeleteEventByIdMutation as useDeleteEventFromProductionByIdMutation,
} from '@/hooks/api/productions';
import type {
  FormDataUnion,
  StepProps,
  StepsConfiguration,
} from '@/pages/steps/Steps';
import type { Production } from '@/types/Production';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icon, Icons } from '@/ui/Icon';
import { getInlineProps, Inline } from '@/ui/Inline';
import type { StackProps } from '@/ui/Stack';
import { getStackProps } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { Typeahead } from '@/ui/Typeahead';
import { valueToArray } from '@/utils/valueToArray';

import { UseEditArguments } from './hooks/useEditField';

type ProductionStepProps = StackProps & StepProps;

const getGlobalValue = getValueFromTheme('global');

const useEditNameAndProduction = ({
  scope,
  onSuccess,
  offerId,
}: UseEditArguments) => {
  const getEventByIdQuery = useGetEventByIdQuery({ id: offerId, scope });

  const createProductionWithEventsMutation =
    useCreateProductionWithEventsMutation();
  const addEventToProductionByIdMutation =
    useAddEventToProductionByIdMutation();
  const deleteEventFromProductionByIdMutation =
    useDeleteEventFromProductionByIdMutation();

  const changeNameMutation = useChangeNameMutation({
    onSuccess: () => onSuccess('name'),
  });

  return async ({ production }: FormDataUnion) => {
    if (!production) return;

    // unlink event from current production
    // @ts-expect-error
    if (getEventByIdQuery.data?.production?.id) {
      await deleteEventFromProductionByIdMutation.mutateAsync({
        // @ts-expect-error
        productionId: getEventByIdQuery.data.production.id,
        offerId,
      });
    }

    if (production.customOption) {
      // make new production with name and event id
      await createProductionWithEventsMutation.mutateAsync({
        productionName: production.name,
        eventIds: [offerId],
      });
    } else {
      // link event to production
      await addEventToProductionByIdMutation.mutateAsync({
        productionId: production.production_id,
        eventId: offerId,
      });
    }

    // change name of event
    await changeNameMutation.mutateAsync({
      id: offerId,
      lang: 'nl',
      name: production.name,
    });
  };
};

const ProductionStep = ({
  formState: { errors },
  control,
  getValues,
  reset,
  name,
  onChange,
  ...props
}: ProductionStepProps) => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState('');

  const getProductionsQuery = useGetProductionsQuery(
    // @ts-expect-error
    {
      name: searchInput,
    },
    { enabled: !!searchInput },
  );

  const productions = useMemo(
    // @ts-expect-error
    () => getProductionsQuery.data?.member ?? [],
    [
      // @ts-expect-error
      getProductionsQuery.data?.member,
    ],
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const selectedProduction = field?.value;

        if (!selectedProduction) {
          return (
            <FormElement
              id="production-step-name-typeahead"
              label={t('movies.create.actions.choose_name')}
              error={
                errors?.production
                  ? t(
                      `movies.create.validation_messages.production.${errors.production.type}`,
                    )
                  : undefined
              }
              Component={
                <Typeahead<Production>
                  newSelectionPrefix={t(
                    'create.additionalInformation.production.add_new_label',
                  )}
                  allowNew
                  options={productions}
                  onInputChange={debounce(setSearchInput, 275)}
                  labelKey="name"
                  maxWidth="43rem"
                  selected={valueToArray(field.value as Production)}
                  onChange={(productions) => {
                    const production = productions[0];
                    field.onChange(production);
                    onChange(production);
                  }}
                  minLength={3}
                />
              }
              {...getStackProps(props)}
            />
          );
        }

        return (
          <Inline alignItems="center" spacing={3} {...getInlineProps(props)}>
            <Icon
              name={Icons.CHECK_CIRCLE}
              color={getGlobalValue('successIcon')}
            />
            <Text>{selectedProduction.name}</Text>
            <Button
              variant={ButtonVariants.LINK}
              onClick={() =>
                reset(
                  { ...(getValues() as any), production: undefined },
                  { keepDirty: true },
                )
              }
            >
              {t('movies.create.actions.change_name')}
            </Button>
          </Inline>
        );
      }}
    />
  );
};

const productionStepConfiguration: StepsConfiguration<'production'> = {
  Component: ProductionStep,
  validation: yup.object().shape({}).required(),
  name: 'production',
  shouldShowStep: ({ watch }) => !!watch('location.place'),
  title: ({ t }) => t(`movies.create.step4.title`),
};

export { productionStepConfiguration, useEditNameAndProduction };
