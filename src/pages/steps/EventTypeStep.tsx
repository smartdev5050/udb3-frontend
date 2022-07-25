import { useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { EventType, useGetTermsQuery } from '@/hooks/api/terms';
import { Button, ButtonVariants } from '@/ui/Button';
import { Inline } from '@/ui/Inline';
import { Stack } from '@/ui/Stack';

import { FormDataIntersection, StepProps } from './Steps';

const EventTypeStep = <TFormData extends FormDataIntersection>({
  control,
  field,
  onChange,
  getValues,
  watch,
}: StepProps<TFormData>) => {
  const { t, i18n } = useTranslation();

  const getTermsQuery = useGetTermsQuery();

  const terms = getTermsQuery.data?.terms;

  const eventOrLocation = watch('type');

  console.log({ eventOrLocation });

  const eventType = watch('eventType');

  console.log({ eventType });

  const themes = useMemo(() => {
    if (!eventType?.theme?.id) return [];

    return (
      (terms ?? []).find((term: EventType) => {
        return term.id === eventType.theme.id;
      }).otherSuggestedTerms ?? []
    );
  }, [terms, eventType]);

  console.log(themes);

  const eventTypes = useMemo(() => {
    return (terms ?? []).filter(
      (term) =>
        term.domain === 'eventtype' && term.scope.includes(eventOrLocation),
    );
  }, [terms, eventOrLocation]);

  console.log({ eventTypes });

  return (
    <Controller<TFormData>
      control={control}
      name={field}
      render={({ field }) => {
        return (
          <Inline spacing={3} flexWrap="wrap" maxWidth="70rem">
            {!eventType &&
              eventTypes.map((eventType: EventType) => (
                <Button
                  key={eventType.id}
                  variant={ButtonVariants.SECONDARY}
                  width="auto"
                  marginBottom={3}
                  display="inline-flex"
                  onClick={() => {
                    field.onChange({
                      ...field.value,
                      theme: {
                        id: eventType.id,
                        label: eventType.name[i18n.language],
                      },
                    });
                    onChange(eventType.id);
                  }}
                >
                  {eventType.name[i18n.language]}
                </Button>
              ))}
            {eventType && (
              <Stack>
                <p>{eventType.theme.label}</p>
                <Inline spacing={3} flexWrap="wrap" maxWidth="70rem">
                  {themes.map((theme) => (
                    <Button
                      key={theme.id}
                      variant={ButtonVariants.SECONDARY}
                      width="auto"
                      marginBottom={3}
                      display="inline-flex"
                    >
                      {theme.name[i18n.language]}
                    </Button>
                  ))}
                </Inline>
              </Stack>
            )}
          </Inline>
        );
      }}
    />
  );
};

const eventTypeStepConfiguration = {
  Component: EventTypeStep,
  field: 'eventType',
  title: (t) => 'Kies een event type?',
};

export { EventTypeStep, eventTypeStepConfiguration };
