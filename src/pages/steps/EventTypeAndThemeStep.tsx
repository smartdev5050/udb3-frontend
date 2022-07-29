import { Button } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { useChangeThemeMutation } from '@/hooks/api/events';
import { useGetTypesByScopeQuery } from '@/hooks/api/types';
import { ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Label, LabelVariants } from '@/ui/Label';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

import { FormDataIntersection, StepProps } from './Steps';

const getValue = getValueFromTheme('createPage');

const useEditType = <TFormData extends FormDataIntersection>({
  eventId,
  onSuccess,
}) => {
  const changeThemeMutation = useChangeThemeMutation({
    onSuccess: () => onSuccess('type'),
  });

  return async ({ typeAndTheme }: TFormData) => {
    await changeThemeMutation.mutateAsync({
      id: eventId,
      themeId: typeAndTheme.type.id,
    });
  };
};

const useEditTheme = <TFormData extends FormDataIntersection>({
  eventId,
  onSuccess,
}) => {
  const changeThemeMutation = useChangeThemeMutation({
    onSuccess: () => onSuccess('theme'),
  });

  return async ({ typeAndTheme }: TFormData) => {
    await changeThemeMutation.mutateAsync({
      id: eventId,
      themeId: typeAndTheme.theme.id,
    });
  };
};

const EventTypeAndThemeStep = <TFormData extends FormDataIntersection>({
  control,
  reset,
  field,
  getValues,
  onChange,
  watch,
}: StepProps<TFormData>) => {
  const { t, i18n } = useTranslation();

  const watchedScope = watch('scope', undefined);

  const getTypesByScopeQuery = useGetTypesByScopeQuery({
    scope: watchedScope,
  });

  const types = getTypesByScopeQuery.data ?? [];

  const watchedTypeAndTheme = watch('typeAndTheme');

  const themes =
    types?.find((type) => type.id === watchedTypeAndTheme?.type?.id)
      ?.otherSuggestedTerms ?? [];

  return (
    <Controller<TFormData>
      name={field}
      control={control}
      render={({ field }) => {
        return (
          <Stack spacing={4}>
            {!field.value?.type?.id ? (
              <Inline spacing={3} flexWrap="wrap" maxWidth="70rem">
                {types.map(({ id, name }) => (
                  <Button
                    width="auto"
                    marginBottom={3}
                    display="inline-flex"
                    key={id}
                    variant={ButtonVariants.SECONDARY}
                    onClick={() => {
                      field.onChange({
                        ...field.value,
                        type: { id, label: name[i18n.language] },
                      });
                      onChange(id);
                    }}
                  >
                    {name[i18n.language]}
                  </Button>
                ))}
              </Inline>
            ) : (
              <Inline alignItems="center" spacing={3}>
                <Icon
                  name={Icons.CHECK_CIRCLE}
                  color={getValue('check.circleFillColor')}
                />
                <Text>{field.value?.type?.label}</Text>
                <Button
                  variant={ButtonVariants.LINK}
                  onClick={() =>
                    reset(
                      {
                        ...(getValues() as any),
                        typeAndTheme: {
                          type: undefined,
                          theme: undefined,
                        },
                      },
                      { keepDirty: true },
                    )
                  }
                >
                  Wijzig type
                </Button>
              </Inline>
            )}
            {themes.length > 0 && (
              <Label variant={LabelVariants.BOLD}>Verfijn</Label>
            )}
            {!field.value?.theme?.id ? (
              <Inline spacing={3} flexWrap="wrap" maxWidth="70rem">
                {themes.map(({ id, name }) => (
                  <Button
                    width="auto"
                    marginBottom={3}
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
                  >
                    {name[i18n.language]}
                  </Button>
                ))}
              </Inline>
            ) : (
              <Inline alignItems="center" spacing={3}>
                <Icon
                  name={Icons.CHECK_CIRCLE}
                  color={getValue('check.circleFillColor')}
                />
                <Text>{field.value?.theme?.label}</Text>
                <Button
                  variant={ButtonVariants.LINK}
                  onClick={() =>
                    reset(
                      {
                        ...(getValues() as any),
                        typeAndTheme: {
                          ...(getValues() as any).typeAndTheme,
                          theme: undefined,
                        },
                      },
                      { keepDirty: true },
                    )
                  }
                >
                  Wijzig thema
                </Button>
              </Inline>
            )}
          </Stack>
        );
      }}
    />
  );
};

const eventTypeAndThemeStepConfiguration = {
  Component: EventTypeAndThemeStep,
  defaultValue: {},
  field: 'typeAndTheme',
  validation: yup.object().shape({}).required(),
  title: (t) => t(`movies.create.step1.title`),
};

export { eventTypeAndThemeStepConfiguration, useEditTheme };
