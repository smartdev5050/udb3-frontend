import { throttle } from 'lodash';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetProductions } from '@/hooks/api/productions';
import type { Production } from '@/types/Production';
import type { StackProps } from '@/ui/Stack';
import { getStackProps } from '@/ui/Stack';
import { TypeaheadWithLabel } from '@/ui/TypeaheadWithLabel';

import type { MachineProps } from './create';

type Step4ContentProps = StackProps & MachineProps;

const Step4Content = ({
  movieState,
  sendMovieEvent,
  ...props
}: Step4ContentProps) => {
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
    <TypeaheadWithLabel<Production>
      id="step4-name-typeahead"
      label={t('movies.create.actions.choose_name')}
      options={productions}
      onInputChange={throttle(setSearchInput, 275)}
      labelKey={(production) => production.name}
      maxWidth="43rem"
      onChange={(value) => {
        if (value.length === 0) {
          sendMovieEvent({ type: 'CLEAR_PRODUCTION' });
          return;
        }
        sendMovieEvent({ type: 'CHOOSE_PRODUCTION', value: value[0] });
      }}
      minLength={3}
      {...getStackProps(props)}
    />
  );
};

export { Step4Content };
