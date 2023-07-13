import { FormEvent, useEffect } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import { useGetOrganizersByWebsiteQuery } from '@/hooks/api/organizers';
import { SupportedLanguage } from '@/i18n/index';
import { StepProps } from '@/pages/steps/Steps';
import { Organizer } from '@/types/Organizer';
import { Alert, AlertVariants } from '@/ui/Alert';
import { FormElement } from '@/ui/FormElement';
import { Input } from '@/ui/Input';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { getLanguageObjectOrFallback } from '@/utils/getLanguageObjectOrFallback';

type UrlStepProps = StackProps & StepProps;

const UrlStep = ({
  formState: { errors },
  control,
  watch,
  onChange,
  mainLanguage,
  setError,
  clearErrors,
  name,
  ...props
}: UrlStepProps) => {
  const { t, i18n } = useTranslation();

  const [watchedUrl] = useWatch({
    control,
    name: ['nameAndUrl.url'],
  });

  const getOrganizersByWebsiteQuery = useGetOrganizersByWebsiteQuery(
    {
      website: watchedUrl,
    },
    { enabled: !!watchedUrl },
  );

  const existingOrganization: Organizer | undefined =
    // @ts-expect-error
    getOrganizersByWebsiteQuery.data?.member?.[0];
  const isUrlUnique = !existingOrganization;

  const isUrlAlreadyTaken = errors.nameAndUrl?.url?.type === 'not_unique';

  useEffect(() => {
    if (!isUrlUnique) {
      setError('nameAndUrl.url', { type: 'not_unique' });
      return;
    }
    clearErrors('nameAndUrl.url');
  }, [isUrlUnique, setError, clearErrors]);

  return (
    <Stack {...getStackProps(props)}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <Stack spacing={2}>
              <FormElement
                label="Website"
                id="organizer-url"
                flex={2}
                Component={
                  <Input
                    value={field.value?.url}
                    onChange={(event) => {
                      field.onChange({
                        ...field.value,
                        url: (event.target as HTMLInputElement).value,
                      });
                    }}
                    onBlur={(event: FormEvent<HTMLInputElement>) => {
                      field.onChange({
                        ...field.value,
                        url: (event.target as HTMLInputElement).value,
                      });
                    }}
                  />
                }
                info={
                  isUrlAlreadyTaken && existingOrganization ? (
                    <Alert variant={AlertVariants.WARNING}>
                      <Trans
                        i18nKey={`organizer.add.validation_messages.url_not_unique`}
                        values={{
                          organizerName: getLanguageObjectOrFallback(
                            existingOrganization?.name,
                            i18n.language as SupportedLanguage,
                            existingOrganization.mainLanguage as SupportedLanguage,
                          ),
                        }}
                      />
                    </Alert>
                  ) : (
                    <Alert variant={AlertVariants.PRIMARY}>
                      {t('organizer.add.url_requirements')}
                    </Alert>
                  )
                }
                error={
                  errors.nameAndUrl?.url.type === 'required' && 'Verplicht veld'
                }
              />
            </Stack>
          );
        }}
      />
    </Stack>
  );
};

export { UrlStep };
