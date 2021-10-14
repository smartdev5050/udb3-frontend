import { throttle } from 'lodash';
import { useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useGetProductions } from '@/hooks/api/productions';
import type { Production } from '@/types/Production';
import type { StackProps } from '@/ui/Stack';
import { getStackProps } from '@/ui/Stack';
import { TypeaheadWithLabel } from '@/ui/TypeaheadWithLabel';

import { Step } from './Step';

type Step4Props = StackProps;

const Step4 = ({ errors, control, ...props }: Step4Props) => {
  console.log({ errors });
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
          return (
            <TypeaheadWithLabel<Production>
              newSelectionPrefix="Voeg nieuwe productie toe:"
              allowNew
              error={errors.production ? 'this is another error' : undefined}
              id="step4-name-typeahead"
              label={t('movies.create.actions.choose_name')}
              options={productions}
              onInputChange={throttle(setSearchInput, 275)}
              labelKey="name"
              maxWidth="43rem"
              selected={field.value}
              onChange={(value) => field.onChange(value)}
              minLength={3}
              {...getStackProps(props)}
            />
          );
        }}
      />
    </Step>
  );
};

export { Step4 };
