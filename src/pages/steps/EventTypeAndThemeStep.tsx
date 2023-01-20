import { groupBy, pick } from 'lodash';
import { useMemo } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import * as yup from 'yup';

import { OfferType, OfferTypes } from '@/constants/OfferType';
import {
  useChangeOfferThemeMutation,
  useChangeOfferTypeMutation,
} from '@/hooks/api/offers';
import { useGetTypesByScopeQuery } from '@/hooks/api/types';
import { Term } from '@/types/Offer';
import { parseSpacing } from '@/ui/Box';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Label, LabelVariants } from '@/ui/Label';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { Title } from '@/ui/Title';

import { FormDataUnion, StepProps, StepsConfiguration } from './Steps';

const DANS_THEME_IDS = [
  '1.9.1.0.0', // Ballet en klassieke dans
  '1.9.2.0.0', // Moderne dans
  '1.9.5.0.0', // Stijl en salondansen
  '1.9.3.0.0', // Volksdans en werelddans
];

const KUNST_EN_ERFGOED_THEME_IDS = [
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

const MUZIEK_THEME_IDS = [
  '1.1.0.0.0', // Audiovisuele kunst
];

const groupNameToThemeIds = {
  Dans: DANS_THEME_IDS,
  'Kunst en Erfgoed': KUNST_EN_ERFGOED_THEME_IDS,
  Muziek: MUZIEK_THEME_IDS,
} as const;

const getGlobalValue = getValueFromTheme('global');

const useEditTypeAndTheme = ({ scope, offerId }) => {
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

  const typeAndTheme = useWatch({
    control,
    name: 'typeAndTheme',
  });

  const getTypesByScopeQuery = useGetTypesByScopeQuery({
    scope,
  });

  const types = getTypesByScopeQuery.data ?? [];

  const themes =
    types?.find((type) => type.id === typeAndTheme?.type?.id)
      ?.otherSuggestedTerms ?? [];

  const themeGroups = groupBy(themes, (theme) => {
    const foundGroupPair = Object.entries(groupNameToThemeIds).find(
      ([, themeIds]) => themeIds.includes(theme.id),
    );
    if (!foundGroupPair) return 'rest';
    const [groupName] = foundGroupPair;
    return groupName;
  });

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <Stack spacing={4}>
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
                    {types.map(({ id, name }) => (
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
              <Stack spacing={3} maxWidth="70rem">
                {Object.entries(themeGroups).map(([groupName, themes]) => (
                  <Inline
                    spacing={3}
                    flexWrap="wrap"
                    css={`
                      row-gap: ${parseSpacing(3.5)()};
                    `}
                    key={groupName}
                  >
                    <Title>{groupName}</Title>
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

const typeAndThemeStepConfiguration: StepsConfiguration = {
  Component: EventTypeAndThemeStep,
  name: 'typeAndTheme',
  validation: yup.object().shape({}).required(),
  title: ({ t, scope }) => t(`create.type_and_theme.title_${scope}`),
  shouldShowStep: ({ scope }) => !!scope,
};

export { typeAndThemeStepConfiguration, useEditTypeAndTheme };
