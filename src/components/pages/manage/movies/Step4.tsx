import debounce from 'lodash/debounce';
import { useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useGetProductions } from '@/hooks/api/productions';
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

import type { StepProps } from './MoviePage';
import { Step } from './Step';

type Step4Props = StackProps & StepProps;

const getValue = getValueFromTheme('moviesCreatePage');

const Step4 = ({
  errors,
  control,
  getValues,
  reset,
  onChange,
  ...props
}: Step4Props) => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState('');

  const useGetProductionsQuery = useGetProductions(
    // @ts-expect-error
    {
      name: searchInput,
    },
    { enabled: !!searchInput },
  );

  // @ts-expect-error
  const productions = useMemo(() => useGetProductionsQuery.data?.member ?? [], [
    // @ts-expect-error
    useGetProductionsQuery.data?.member,
  ]);

  return (
    <Step stepNumber={4}>
      <Controller
        control={control}
        name="production"
        render={({ field }) => {
          const selectedProduction = field?.value;

          if (!selectedProduction) {
            return (
              <FormElement
                id="step4-name-typeahead"
                label={t('movies.create.actions.choose_name')}
                error={
                  errors.production
                    ? t(
                        `movies.create.validation_messages.production.${errors.production.type}`,
                      )
                    : undefined
                }
                Component={
                  <Typeahead<Production & { customOption?: boolean }>
                    newSelectionPrefix="Voeg nieuwe productie toe: "
                    allowNew
                    options={productions}
                    onInputChange={debounce(setSearchInput, 275)}
                    labelKey="name"
                    maxWidth="43rem"
                    selected={field.value ? [field.value] : []}
                    onChange={(value) => {
                      field.onChange(value?.[0]);
                      onChange(value?.[0]);
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
                color={getValue('check.circleFillColor')}
              />
              <Text>{selectedProduction.name}</Text>
              <Button
                variant={ButtonVariants.LINK}
                onClick={() =>
                  reset(
                    { ...getValues(), production: undefined },
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
    </Step>
  );
};

export { Step4 };
