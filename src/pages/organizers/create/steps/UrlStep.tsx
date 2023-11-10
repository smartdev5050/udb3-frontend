import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import { ScopeTypes } from '@/constants/OfferType';
import { useGetOrganizersByWebsiteQuery } from '@/hooks/api/organizers';
import { useDebounce } from '@/hooks/useDebounce';
import { SupportedLanguage } from '@/i18n/index';
import { StepProps } from '@/pages/steps/Steps';
import { Organizer } from '@/types/Organizer';
import { Alert, AlertVariants } from '@/ui/Alert';
import { FormElement } from '@/ui/FormElement';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { RadioButton, RadioButtonTypes } from '@/ui/RadioButton';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { getLanguageObjectOrFallback } from '@/utils/getLanguageObjectOrFallback';
import { isValidUrl } from '@/utils/isValidInfo';
import { parseOfferId } from '@/utils/parseOfferId';
import { prefixUrlWithHttps } from '@/utils/url';
import { LabelPositions } from '@/ui/Label';

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
  const { query } = useRouter();
  const { t, i18n } = useTranslation();

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchInput = useDebounce(searchInput, 275);

  const getOrganizersByWebsiteQuery = useGetOrganizersByWebsiteQuery(
    {
      website: debouncedSearchInput,
    },
    { enabled: !!debouncedSearchInput && isValidUrl(debouncedSearchInput) },
  );

  const existingOrganizers: Organizer[] | undefined =
    // @ts-expect-error
    getOrganizersByWebsiteQuery.data?.member;
  const existingOrganizer = existingOrganizers?.[0];

  const isUrlAlreadyTaken = errors.nameAndUrl?.url?.type === 'not_unique';

  useEffect(() => {
    if (!isValidUrl(searchInput)) {
      setError('nameAndUrl.url', { type: 'matches' });
      return;
    }

    clearErrors('nameAndUrl.url');
  }, [searchInput, clearErrors, setError]);

  useEffect(() => {
    if (
      existingOrganizer &&
      parseOfferId(existingOrganizer['@id']) !== query.organizerId
    ) {
      setError('nameAndUrl.url', { type: 'not_unique' });
      return;
    }
    clearErrors('nameAndUrl.url');
  }, [
    existingOrganizer,
    // @ts-expect-error
    getOrganizersByWebsiteQuery.data,
    setError,
    clearErrors,
  ]);

  return (
    <Stack {...getStackProps(props)}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const isUrlInvalid =
            errors.nameAndUrl && errors.nameAndUrl?.url?.type !== 'not_unique';

          return (
            <Stack spacing={2}>
              <FormElement
                label={t('organizers.create.step1.url')}
                id="organizer-url"
                flex={2}
                Component={
                  <Input
                    value={field.value?.url}
                    onChange={(event) => {
                      const value = (event.target as HTMLInputElement).value;
                      setSearchInput(value);
                      field.onChange({
                        ...field.value,
                        url: value,
                      });
                    }}
                    onBlur={(event: FormEvent<HTMLInputElement>) => {
                      const newValue = (event.target as HTMLInputElement).value;
                      const prefixedValue = prefixUrlWithHttps(newValue);
                      setSearchInput(prefixedValue);
                      field.onChange({
                        ...field.value,
                        url: prefixedValue,
                      });
                      onChange({
                        ...field.value,
                        url: prefixedValue,
                      });
                    }}
                  />
                }
                info={
                  <>
                    {searchInput && isUrlAlreadyTaken && existingOrganizer && (
                      <Alert variant={AlertVariants.WARNING}>
                        <Trans
                          i18nKey={`organizers.create.step1.errors.url_not_unique`}
                          values={{
                            organizerName: getLanguageObjectOrFallback(
                              existingOrganizer?.name,
                              i18n.language as SupportedLanguage,
                              existingOrganizer.mainLanguage as SupportedLanguage,
                            ),
                          }}
                        />
                      </Alert>
                    )}
                    {(!searchInput || isUrlInvalid) && (
                      <Alert variant={AlertVariants.PRIMARY}>
                        {t('organizers.create.step1.url_requirements')}
                      </Alert>
                    )}
                    {existingOrganizers?.length === 0 && (
                      <Alert variant={AlertVariants.SUCCESS}>
                        {t('organizers.create.step1.errors.url_valid')}
                      </Alert>
                    )}
                    {props.scope === ScopeTypes.ORGANIZERS &&
                      !props.offerId && (
                        <Controller
                          control={control}
                          name={'nameAndUrl.isContactUrl'}
                          render={({ field: { value, ...field } }) => (
                            <FormElement
                              id={field.name}
                              label={t(
                                'organizers.create.step1.is_contact_url',
                              )}
                              labelPosition={LabelPositions.RIGHT}
                              Component={
                                <RadioButton
                                  type={RadioButtonTypes.SWITCH}
                                  checked={value}
                                  {...field}
                                />
                              }
                            />
                          )}
                        />
                      )}
                  </>
                }
                error={
                  isUrlInvalid &&
                  t(
                    `organizers.create.step1.errors.url_${errors.nameAndUrl?.url.type}`,
                  )
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
