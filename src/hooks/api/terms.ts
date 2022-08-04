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

const getTerms = async (): Promise<TermsData> => {
  const { publicRuntimeConfig } = getConfig();
  const res = await fetch(`${publicRuntimeConfig.taxonomyUrl}/terms`);
  return await res.json();
};

const useGetTermsQuery = (configuration = { retry: false }) =>
  useQuery(['terms'], getTerms, configuration);

export { useGetTermsQuery };
export type { EventType };
