import { Controller, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import {
  useChangeThemeMutation,
  useChangeTypeMutation,
} from '@/hooks/api/events';
import { useGetTypesByScopeQuery } from '@/hooks/api/types';
import { parseSpacing } from '@/ui/Box';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Label, LabelVariants } from '@/ui/Label';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

import { FormDataUnion, StepProps, StepsConfiguration } from './Steps';

const getValue = getValueFromTheme('createPage');
const getGlobalValue = getValueFromTheme('global');

const useEditTypeAndTheme = <TFormData extends FormDataUnion>({
  eventId,
  onSuccess,
}) => {
  const changeTypeMutation = useChangeTypeMutation({
    onSuccess: () => onSuccess('typeAndTheme'),
  });

  const changeThemeMutation = useChangeThemeMutation({
    onSuccess: () => onSuccess('typeAndTheme'),
  });

  return async ({ typeAndTheme }: TFormData) => {
    if (!typeAndTheme.type) return;

    await changeTypeMutation.mutateAsync({
      id: eventId,
      typeId: typeAndTheme.type?.id,
    });

    await changeThemeMutation.mutateAsync({
      id: eventId,
      themeId: typeAndTheme.theme?.id,
    });
  };
};

type Props<TFormData extends FormDataUnion> = StepProps<TFormData> & {
  shouldHideType: boolean;
};

const EventTypeAndThemeStep = <TFormData extends FormDataUnion>({
  control,
  name,
  getValues,
  onChange,
  shouldHideType,
}: Props<TFormData>) => {
  const { t, i18n } = useTranslation();

  const watchedValues = useWatch({ control });

  const getTypesByScopeQuery = useGetTypesByScopeQuery({
    scope: watchedValues.scope,
  });

  const types = getTypesByScopeQuery.data ?? [];

  const themes =
    types?.find((type) => type.id === watchedValues?.typeAndTheme?.type?.id)
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
                              theme.components.button.secondary.boxShadow
                                .small};
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
                          theme.components.button.secondary.boxShadow.small};
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
                  color={getGlobalValue('succcessIcon')}
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

const typeAndThemeStepConfiguration: StepsConfiguration<FormDataUnion> = {
  Component: EventTypeAndThemeStep,
  name: 'typeAndTheme',
  validation: yup.object().shape({}).required(),
  title: ({ t, watch }) => t(`create.type_and_theme.title_${watch('scope')}`),
  shouldShowStep: ({ watch }) => !!watch('scope'),
};

export { typeAndThemeStepConfiguration, useEditTypeAndTheme };
