import { useMemo } from 'react';

import { useGetTermsQuery } from '@/hooks/api/terms';
import { Scope } from '@/pages/create/EventForm';

type GetThemesByEventTypeIdArguments = {
  scope: Scope;
};

const useGetTypesByScopeQuery = (
  { scope }: GetThemesByEventTypeIdArguments,
  configuration: any = {},
) => {
  const getTermsQuery = useGetTermsQuery({
    enabled: !!scope,
    ...configuration,
  });

  const data = useMemo(() => {
    if (!getTermsQuery.data?.terms) return;
    const terms = getTermsQuery.data.terms.filter(
      (term) => term.scope.includes(scope) && term.domain === 'eventtype',
    );
    return terms;
  }, [getTermsQuery.data?.terms, scope]);

  return { ...getTermsQuery, data };
};

export { useGetTypesByScopeQuery };
