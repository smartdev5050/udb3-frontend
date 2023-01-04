import { Controller, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { OfferType, OfferTypes } from '@/constants/OfferType';
import {
  useChangeOfferThemeMutation,
  useChangeOfferTypeMutation,
} from '@/hooks/api/offers';
import { useGetTypesByScopeQuery } from '@/hooks/api/types';
import { Values } from '@/types/Values';
import { parseSpacing } from '@/ui/Box';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Label, LabelVariants } from '@/ui/Label';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

import { FormDataUnion, StepProps, StepsConfiguration } from './Steps';

const getGlobalValue = getValueFromTheme('global');

const useEditTypeAndTheme = ({ scope, offerId, onSuccess }) => {
  const changeTypeMutation = useChangeOfferTypeMutation({
    onSuccess: () => onSuccess('typeAndTheme'),
  });

  const changeThemeMutation = useChangeOfferThemeMutation({
    onSuccess: () => onSuccess('typeAndTheme'),
  });

  return async ({ typeAndTheme }: FormDataUnion) => {
    if (!typeAndTheme.type) return;

    await changeTypeMutation.mutateAsync({
      id: offerId,
      typeId: typeAndTheme.type?.id,
      scope,
    });

    await changeThemeMutation.mutateAsync({
      id: offerId,
      themeId: typeAndTheme.theme?.id,
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
              <Inline
                spacing={3}
                flexWrap="wrap"
                maxWidth="70rem"
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
