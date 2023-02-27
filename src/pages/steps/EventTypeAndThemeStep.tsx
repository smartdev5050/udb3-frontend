import { groupBy, mapValues, sortBy } from 'lodash';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import * as yup from 'yup';

import { OfferType, OfferTypes } from '@/constants/OfferType';
import {
  useChangeOfferThemeMutation,
  useChangeOfferTypeMutation,
} from '@/hooks/api/offers';
import { EventType } from '@/hooks/api/terms';
import { useGetTypesByScopeQuery } from '@/hooks/api/types';
import { Term } from '@/types/Offer';
import { parseSpacing } from '@/ui/Box';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Label, LabelVariants } from '@/ui/Label';
import { Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

import { UseEditArguments } from './hooks/useEditField';
import { FormDataUnion, StepProps, StepsConfiguration } from './Steps';
import { eventTypeGroups } from '@/constants/EventTypes';
import { Title } from '@/ui/Title';

const DANCE_THEME_IDS = [
  '1.9.1.0.0', // Ballet en klassieke dans
  '1.9.2.0.0', // Moderne dans
  '1.9.5.0.0', // Stijl en salondansen
  '1.9.3.0.0', // Volksdans en werelddans
];

const ART_AND_HERITAGE_THEME_IDS = [
  '1.1.0.0.0', // Audiovisuele kunst
  '1.0.2.0.0', // Beeldhouwkunst
  '0.52.0.0.0', // Circus
  '1.42.0.0.0', // Creativiteit
  '1.0.5.0.0', // Decoratieve kunst
  '1.2.2.0.0', // Design
  '1.40.0.0.0', // Erfgoed
  '1.0.6.0.0', // Fotografie
  '1.0.4.0.0', // Grafiek
  '1.10.0.0.0', // Literatuur
  '1.0.9.0.0', // Meerdere kunstvormen
  '1.49.0.0.0', // Mode
  '1.10.5.0.0', // Poezie
  '1.0.1.0.0', // Schilderkunst
  '1.3.1.0.0', // Tekst en muziektheater
];

const MUSIC_THEME_IDS = [
  '1.8.3.5.0', // Amusementsmuziek
  '1.8.3.3.0', // Dance muziek
  '1.8.4.0.0', // Folk en wereldmuziek
  '1.8.3.2.0', // Hip hop, rnb en rap
  '1.8.2.0.0', // Jazz en blues
  '1.8.1.0.0', // Klassieke muziek
  '1.8.3.1.0', // Pop en rock
];

const SPORT_THEME_IDS = [
  '1.51.14.0.0', // Atletiek, wandelen en fietsen
  '1.51.13.0.0', // Bal en racketsport
  '1.51.6.0.0', // Fitness, gymnastiek, dans en vechtsport
  '1.58.8.0.0', // Lucht en motorsport
  '1.51.12.0.0', // Omnisport en andere
  '1.51.11.0.0', // Outdoor en Adventure sport
  '1.51.10.0.0', // Volkssporten
  '1.51.3.0.0', // Zwemmen en watersport
];

const VARIOUS_THEME_IDS = [
  '1.21.0.0.0', // Computer and techniek
  '1.37.1.0.0', // Gezondheid en zorg
  '1.43.0.0.0', // Interculturele vorming
  '1.64.0.0.0', // Milieu en natuur
  '1.37.0.0.0', // Opvoeding
  '1.61.0.0.0', // Persoon en relaties
  '1.37.2.0.0', // Samenleving
  '1.65.0.0.0', // Voeding
  '1.25.0.0.0', // Wetenschap
  '1.44.0.0.0', // Zingeving, filosofie en religie
];

const groupNameToThemeIds = {
  dance: DANCE_THEME_IDS,
  art_and_heritage: ART_AND_HERITAGE_THEME_IDS,
  music: MUSIC_THEME_IDS,
  sport: SPORT_THEME_IDS,
  various: VARIOUS_THEME_IDS,
} as const;

const getGlobalValue = getValueFromTheme('global');

const useEditTypeAndTheme = ({ scope, offerId }: UseEditArguments) => {
  const queryClient = useQueryClient();

  const changeTypeMutation = useChangeOfferTypeMutation({
    onMutate: async (newPayload) => {
      await queryClient.cancelQueries({
        queryKey: [scope, { id: offerId }],
      });

      const previousEventInfo: any = queryClient.getQueryData([
        scope,
        { id: offerId },
      ]);

      const terms: Term[] = previousEventInfo.terms.filter((term: Term) => {
        return term.domain !== 'eventtype';
      });

      if (newPayload.typeId) {
        terms.push({
          id: newPayload.typeId,
          domain: 'eventtype',
          label: newPayload.typeLabel,
        });
      }

      queryClient.setQueryData([scope, { id: offerId }], () => {
        return { ...previousEventInfo, terms };
      });

      return { previousEventInfo };
    },
    onError: (_err, _newBookingInfo, context) => {
      queryClient.setQueryData(
        [scope, { id: offerId }],
        context.previousEventInfo,
      );
    },
  });

  const changeThemeMutation = useChangeOfferThemeMutation({
    onMutate: async (newPayload) => {
      await queryClient.cancelQueries({
        queryKey: [scope, { id: offerId }],
      });

      const previousEventInfo: any = queryClient.getQueryData([
        scope,
        { id: offerId },
      ]);

      const terms: Term[] = previousEventInfo.terms.filter((term: Term) => {
        return term.domain !== 'theme';
      });

      if (newPayload.themeId) {
        terms.push({
          id: newPayload.themeId,
          domain: 'theme',
          label: newPayload.themeLabel,
        });
      }

      queryClient.setQueryData([scope, { id: offerId }], () => {
        return { ...previousEventInfo, terms };
      });

      return { previousEventInfo };
    },
    onError: (_err, _newBookingInfo, context) => {
      queryClient.setQueryData(
        [scope, { id: offerId }],
        context.previousEventInfo,
      );
    },
  });

  return async ({ typeAndTheme }: FormDataUnion) => {
    if (!typeAndTheme.type) return;

    await changeTypeMutation.mutateAsync({
      id: offerId,
      typeId: typeAndTheme.type?.id,
      typeLabel: typeAndTheme.type?.label,
      scope,
    });

    if (scope === OfferTypes.PLACES) return;

    await changeThemeMutation.mutateAsync({
      id: offerId,
      themeId: typeAndTheme.theme?.id,
      themeLabel: typeAndTheme.theme?.label,
      scope,
    });
  };
};

type Props = StepProps & {
  shouldHideType: boolean;
  scope: OfferType;
};

const EventTypeAndThemeStep = ({
  control,
  scope,
  name,
  onChange,
  shouldHideType,
}: Props) => {
  const { t, i18n } = useTranslation();
  const { asPath } = useRouter();
  const [, hash] = asPath.split('#');
  const eventTypeAndThemeContainer = useRef(null);

  const typeAndTheme = useWatch({
    control,
    name: 'typeAndTheme',
  });

  const getTypesByScopeQuery = useGetTypesByScopeQuery({
    scope,
  });

  const sortByLocalizedName = useCallback(
    (events: EventType[]) =>
      sortBy(events, (event) => event.name[i18n.language]),
    [i18n.language],
  );

  const types = useMemo(
    () => sortByLocalizedName(getTypesByScopeQuery.data ?? []),
    [getTypesByScopeQuery.data, sortByLocalizedName],
  );

  const themes = useMemo(
    () =>
      sortByLocalizedName(
        types?.find((type) => type.id === typeAndTheme?.type?.id)
          ?.otherSuggestedTerms ?? [],
      ),
    [typeAndTheme?.type?.id, types, sortByLocalizedName],
  );

  const shouldGroupThemes = [
    '0.3.1.0.1', // Cursus met open sessies
    '0.3.1.0.0', // Lessenreeks
  ].includes(typeAndTheme?.type?.id);

  const themeGroups = useMemo(() => {
    if (!shouldGroupThemes) return {};
    return groupBy(themes, (theme) => {
      const foundGroupPair = Object.entries(groupNameToThemeIds).find(
        ([_, themeIds]) => themeIds.includes(theme.id),
      );
      if (!foundGroupPair) return 'rest';
      const [groupName] = foundGroupPair;
      return groupName;
    });
  }, [shouldGroupThemes, themes]);

  const eventTypeObjectsGroups = useMemo(
    () =>
      mapValues(eventTypeGroups, (values) =>
        types.filter((type) => values.includes(type.id)),
      ),
    [types],
  );

  const handleScroll = () => {
    if (!eventTypeAndThemeContainer.current) return;

    eventTypeAndThemeContainer.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  useEffect(() => {
    if (hash === 'theme') {
      handleScroll();
    }
  }, [hash]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <Stack ref={eventTypeAndThemeContainer} spacing={4}>
            {!shouldHideType && (
              <Stack>
                {!field.value?.type?.id ? (
                  <Inline
                    spacing={3}
                    flexWrap="wrap"
                    maxWidth="70rem"
                    css={`
                      row-gap: ${parseSpacing(3.5)()};
                    `}
                  >
                    {Object.keys(eventTypeObjectsGroups).map((group) => {
                      return (
                        <Stack key={group}>
                          <Title textAlign={'center'}>{group}</Title>
                          {eventTypeObjectsGroups[group].map(({ id, name }) => (
                            <Button
                              width="auto"
                              display="inline-flex"
                              key={id}
                              variant={ButtonVariants.SECONDARY}
                              onClick={() => {
                                field.onChange({
                                  ...field.value,
                                  type: { id, label: name[i18n.language] },
                                });
                                onChange({
                                  ...field.value,
                                  type: { id, label: name[i18n.language] },
                                });
                              }}
                              css={`
                                &.btn {
                                  padding: 0.3rem 0.7rem;
                                  box-shadow: ${({ theme }) =>
                                    theme.components.button.boxShadow.small};
                                }
                              `}
                            >
                              {name[i18n.language]}
                            </Button>
                          ))}
                        </Stack>
                      );
                    })}
                  </Inline>
                ) : (
                  <Inline
                    alignItems="center"
                    spacing={3}
                    css={`
                      row-gap: ${parseSpacing(3.5)()};
                    `}
                  >
                    <Icon
                      name={Icons.CHECK_CIRCLE}
                      color={getGlobalValue('successIcon')}
                    />
                    <Text>{field.value?.type?.label}</Text>
                    <Button
                      variant={ButtonVariants.LINK}
                      onClick={() => {
                        field.onChange({
                          ...field.value,
                          type: undefined,
                          theme: undefined,
                        });
                      }}
                    >
                      {t('create.type_and_theme.change_type')}
                    </Button>
                  </Inline>
                )}
              </Stack>
            )}
            {themes.length > 0 && (
              <Label htmlFor="" variant={LabelVariants.BOLD}>
                {t('create.type_and_theme.refine')}
              </Label>
            )}
            {!field.value?.theme?.id ? (
              <Stack spacing={4} maxWidth="70rem">
                {!shouldGroupThemes && (
                  <Inline
                    spacing={3}
                    flexWrap="wrap"
                    css={`
                      row-gap: ${parseSpacing(3.5)()};
                    `}
                  >
                    {themes.map(({ id, name }) => (
                      <Button
                        width="auto"
                        display="inline-flex"
                        key={id}
                        variant={ButtonVariants.SECONDARY}
                        onClick={() => {
                          field.onChange({
                            ...field.value,
                            theme: { id, label: name[i18n.language] },
                          });
                          onChange(id);
                        }}
                        css={`
                          &.btn {
                            padding: 0.3rem 0.7rem;
                            box-shadow: ${({ theme }) =>
                              theme.components.button.boxShadow.small};
                          }
                        `}
                      >
                        {name[i18n.language]}
                      </Button>
                    ))}
                  </Inline>
                )}
                {shouldGroupThemes &&
                  Object.entries(themeGroups).map(([groupName, themes]) => (
                    <Stack key={groupName} spacing={3}>
                      <Text variant={TextVariants.MUTED}>
                        {t(`create.type_and_theme.theme_groups.${groupName}`)}
                      </Text>
                      <Inline
                        spacing={3}
                        flexWrap="wrap"
                        css={`
                          row-gap: ${parseSpacing(3.5)()};
                        `}
                      >
                        {themes.map(({ id, name }) => (
                          <Button
                            width="auto"
                            display="inline-flex"
                            key={id}
                            variant={ButtonVariants.SECONDARY}
                            onClick={() => {
                              field.onChange({
                                ...field.value,
                                theme: { id, label: name[i18n.language] },
                              });
                              onChange(id);
                            }}
                            css={`
                              &.btn {
                                padding: 0.3rem 0.7rem;
                                box-shadow: ${({ theme }) =>
                                  theme.components.button.boxShadow.small};
                              }
                            `}
                          >
                            {name[i18n.language]}
                          </Button>
                        ))}
                      </Inline>
                    </Stack>
                  ))}
              </Stack>
            ) : (
              <Inline
                alignItems="center"
                spacing={3}
                css={`
                  row-gap: ${parseSpacing(3.5)()};
                `}
              >
                <Icon
                  name={Icons.CHECK_CIRCLE}
                  color={getGlobalValue('successIcon')}
                />
                <Text>{field.value?.theme?.label}</Text>
                <Button
                  variant={ButtonVariants.LINK}
                  onClick={() => {
                    field.onChange({
                      ...field.value,
                      theme: undefined,
                    });
                    onChange({
                      ...field.value,
                      theme: undefined,
                    });
                  }}
                >
                  {t('create.type_and_theme.change_theme')}
                </Button>
              </Inline>
            )}
          </Stack>
        );
      }}
    />
  );
};

const typeAndThemeStepConfiguration: StepsConfiguration<'typeAndTheme'> = {
  Component: EventTypeAndThemeStep,
  name: 'typeAndTheme',
  validation: yup.object().shape({}).required(),
  title: ({ t, scope }) => t(`create.type_and_theme.title_${scope}`),
  shouldShowStep: ({ scope }) => !!scope,
};

export { typeAndThemeStepConfiguration, useEditTypeAndTheme };
