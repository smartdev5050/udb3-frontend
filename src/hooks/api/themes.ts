import { useAuthenticatedQuery } from './authenticated-query';

type GetThemesByEventTypeIdArguments = {
  eventTypeId: string;
};

const useGetThemesByEventTypeId = (
  { eventTypeId }: GetThemesByEventTypeIdArguments,
  configuration = {},
) =>
  useAuthenticatedQuery<Record<string, unknown>>({
    queryKey: ['themes'],
    queryFn: getThemesByEventTypeId,
    queryArguments: {
      eventTypeId,
    },
    enabled: eventTypeId,
    ...configuration,
  });

const getThemesByEventTypeId = () => {
  return {
    '1.7.2.0.0': { label_nl: 'Actie- en avonturenfilm' },
    '1.7.12.0.0': { label_nl: 'Animatie en kinderfilms' },
    '1.7.1.0.0': { label_nl: 'Documentaires en reportages' },
    '1.7.6.0.0': { label_nl: 'Griezelfilm of horror' },
    '1.7.8.0.0': { label_nl: 'Historische film' },
    '1.7.3.0.0': { label_nl: 'Komedie' },
    '1.7.13.0.0': { label_nl: 'Kortfilm' },
    '1.7.10.0.0': { label_nl: 'Filmmusical' },
    '1.7.4.0.0': { label_nl: 'Drama' },
    '1.7.7.0.0': { label_nl: 'Science fiction' },
    '1.7.11.0.0': { label_nl: 'Cinefiel' },
    '1.7.14.0.0': { label_nl: 'Meerdere filmgenres' },
    '1.7.15.0.0': { label_nl: 'Thriller' },
  };
};

export { useGetThemesByEventTypeId };
