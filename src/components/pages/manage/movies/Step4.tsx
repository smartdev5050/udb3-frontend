import { throttle } from 'lodash';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetProductions } from '@/hooks/api/productions';
import type { Production } from '@/types/Production';
import type { StackProps } from '@/ui/Stack';
import { getStackProps } from '@/ui/Stack';
import { TypeaheadWithLabel } from '@/ui/TypeaheadWithLabel';

import type { MachineProps } from './create';
import { Step } from './Step';

type Step4Props = StackProps & MachineProps;

const Step4 = ({
  movieState,
  sendMovieEvent,
  isInvalid,
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
      <TypeaheadWithLabel<Production>
        error={isInvalid ? 'this is another error' : undefined}
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
    </Step>
  );
};

export { Step4 };
