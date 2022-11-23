import getConfig from 'next/config';
import { useQuery } from 'react-query';

type TermScope = 'events' | 'places';
type TermDomain = 'eventtype' | 'theme' | 'facility';

type Term = {
  id: string;
  domain: TermDomain;
  name: {
    nl: string;
    fr: string;
    de: string;
    en: string;
  };
  scope: TermScope[];
};

type EventType = Term & {
  otherSuggestedTerms?: Term[];
};

type TermsData = { terms: EventType[] };

const DISABLED_TERMS = [
  '0.51.0.0.0', // Type onbepaald
  '0.100.0.0.0', // Kijken en luisteren
  '0.100.1.0.0', // Doen
  '0.100.2.0.0', // Bezoeken
];

const getTerms = async (): Promise<TermsData> => {
  const { publicRuntimeConfig } = getConfig();
  const res = await fetch(`${publicRuntimeConfig.taxonomyUrl}/terms`);
  const { terms } = await res.json();
  const allowedTerms = terms.filter(
    (term: EventType) => !DISABLED_TERMS.includes(term.id),
  );
  return { terms: allowedTerms };
};

const useGetTermsQuery = (configuration = {}) =>
  useQuery(['terms'], getTerms, {
    retry: false,
    staleTime: Infinity,
    ...configuration,
  });

export { useGetTermsQuery };
export type { EventType };
