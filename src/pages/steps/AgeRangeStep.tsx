import { FormEvent, useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import { Alert, AlertVariants } from '@/ui/Alert';
import { Button, ButtonVariants } from '@/ui/Button';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

const getValue = getValueFromTheme('ageRange');

const AgeRanges = {
  ALL: { apiLabel: '-' },
  TODDLERS: { label: '0-2', apiLabel: '0-2' },
  PRESCHOOLERS: { label: '3-5', apiLabel: '3-5' },
  KIDS: { label: '6-11', apiLabel: '6-11' },
  TEENAGERS: { label: '12-15', apiLabel: '12-15' },
  YOUNGSTERS: { label: '16-26', apiLabel: '16-26' },
  ADULTS: { label: '18+', apiLabel: '18-' },
  SENIORS: { label: '65+', apiLabel: '65-' },
  CUSTOM: {},
} as const;

const AgeRangeStep = ({
  field,
  control,
  onChange,
  ...props
}: {
  field: any;
  control: any;
  onChange: any;
}) => {
  const { t } = useTranslation();

  const [isCustomAgeRange, setIsCustomAgeRange] = useState(false);
  const [customMinAgeRange, setCustomMinAgeRange] = useState('');
  const [customMaxAgeRange, setCustomMaxAgeRange] = useState('');
  const [customAgeRangeError, setCustomAgeRangeError] = useState('');

  const isCustomAgeRangeSelected = (typicalAgeRange: string): boolean => {
    return !Object.keys(AgeRanges).some(
      (key) =>
        AgeRanges[key].apiLabel && AgeRanges[key].apiLabel === typicalAgeRange,
    );
  };

  const resetCustomAgeRange = (): void => {
    setCustomMinAgeRange('');
    setCustomMaxAgeRange('');
    setIsCustomAgeRange(false);
    setCustomAgeRangeError('');
  };

  useEffect(() => {
    if (!field.value?.typicalAgeRange) return;
    const typicalAgeRange = field.value.typicalAgeRange;

    if (isCustomAgeRangeSelected(typicalAgeRange)) {
      const [min, max] = field.value.typicalAgeRange.split('-');

      setCustomMinAgeRange(min ?? '');
      setCustomMaxAgeRange(max ?? '');
      setIsCustomAgeRange(true);
      return;
    }

    resetCustomAgeRange();
  }, [field.value?.typicalAgeRange]);

  const getSelectedAgeRange = (typicalAgeRange: string): string => {
    const foundAgeRange = Object.keys(AgeRanges).find((key: string) => {
      return (
        AgeRanges[key].apiLabel && AgeRanges[key].apiLabel === typicalAgeRange
      );
    });

    if (isCustomAgeRange) {
      return 'CUSTOM';
    }

    if (!foundAgeRange) return 'NONE';

    return foundAgeRange;
  };

  const handleSubmitCustomAgeRange = (): void => {
    if (parseInt(customMinAgeRange) > parseInt(customMaxAgeRange)) {
      setCustomAgeRangeError(
        t('create.name_and_age.age.error_max_lower_than_min'),
      );
      return;
    }

    setCustomAgeRangeError('');

    field.onChange({
      ...field.value,
      typicalAgeRange: `${customMinAgeRange}-${customMaxAgeRange ?? ''}`,
    });

    onChange({
      ...field.value,
      typicalAgeRange: `${customMinAgeRange}-${customMaxAgeRange ?? ''}`,
    });
  };

  const handleMinAgeRangeChange = (value: string): void => {
    setCustomMinAgeRange(value);
    handleSubmitCustomAgeRange();
  };

  const handleMaxAgeRangeChange = (value: string): void => {
    setCustomMaxAgeRange(value);

    if (!customMinAgeRange) {
      setCustomAgeRangeError(t('create.name_and_age.age.error_no_min_age'));
      return;
    }

    handleSubmitCustomAgeRange();
  };

  return (
    <Stack {...getStackProps(props)}>
      <Controller
        name="nameAndAgeRange"
        control={control}
        render={({ field }) => {
          const selectedAgeRange = getSelectedAgeRange(
            field.value?.typicalAgeRange,
          );
          return (
            <Stack spacing={2}>
              <Text fontWeight="bold">
                {t(`create.name_and_age.age.title`)}
              </Text>
              <Inline
                spacing={3}
                flexWrap="wrap"
                maxWidth="40rem"
                css={`
                  row-gap: 0.3rem;
                `}
              >
                {Object.keys(AgeRanges).map((key: string) => {
                  const apiLabel = AgeRanges[key].apiLabel;
                  return (
                    <Button
                      key={key}
                      width="auto"
                      active={selectedAgeRange === key}
                      marginBottom={3}
                      display="inline-flex"
                      variant={ButtonVariants.SECONDARY}
                      onClick={() => {
                        if (key === 'CUSTOM') {
                          setIsCustomAgeRange(true);
                          return;
                        }
                        setIsCustomAgeRange(false);
                        field.onChange({
                          ...field.value,
                          typicalAgeRange: apiLabel,
                        });
                        onChange({
                          ...field.value,
                          typicalAgeRange: apiLabel,
                        });
                      }}
                    >
                      {t(`create.name_and_age.age.${key.toLowerCase()}`)}
                      <Text
                        css={css`
                          color: ${getValue('rangeTextColor')};
                          font-size: 0.9rem;
                        `}
                      >
                        &nbsp; {AgeRanges[key].label ?? ''}
                      </Text>
                    </Button>
                  );
                })}
              </Inline>
              <Inline>
                {isCustomAgeRange && (
                  <Stack spacing={3}>
                    <Inline spacing={3}>
                      <Stack>
                        <Text fontWeight="bold">
                          {t('create.name_and_age.age.from')}
                        </Text>
                        <Input
                          marginRight={3}
                          value={customMinAgeRange}
                          placeholder={t('create.name_and_age.age.from')}
                          onChange={(event) => {
                            const value = (event.target as HTMLInputElement)
                              .value;
                            setCustomMinAgeRange(value);
                          }}
                          onBlur={(event: FormEvent<HTMLInputElement>) => {
                            const value = (event.target as HTMLInputElement)
                              .value;
                            handleMinAgeRangeChange(value);
                          }}
                        />
                      </Stack>
                      <Stack>
                        <Text fontWeight="bold">
                          {t('create.name_and_age.age.till')}
                        </Text>
                        <Input
                          marginRight={3}
                          value={customMaxAgeRange}
                          placeholder={t('create.name_and_age.age.till')}
                          onChange={(event) => {
                            const value = (event.target as HTMLInputElement)
                              .value;
                            setCustomMaxAgeRange(value);
                          }}
                          onBlur={(event: FormEvent<HTMLInputElement>) => {
                            const value = (event.target as HTMLInputElement)
                              .value;
                            handleMaxAgeRangeChange(value);
                          }}
                        />
                      </Stack>
                    </Inline>
                    {customAgeRangeError && (
                      <Alert variant={AlertVariants.DANGER}>
                        {customAgeRangeError}
                      </Alert>
                    )}
                  </Stack>
                )}
              </Inline>
            </Stack>
          );
        }}
      />
    </Stack>
  );
};

export { AgeRangeStep };
