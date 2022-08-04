import { FormEvent } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import { Button, ButtonVariants } from '@/ui/Button';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { Stack } from '@/ui/Stack';
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
}: {
  field: any;
  control: any;
  onChange: any;
}) => {
  const { t } = useTranslation();

  const isCustomAgeRange = (typicalAgeRange: string): boolean => {
    return !Object.keys(AgeRanges).some(
      (key) =>
        AgeRanges[key].apiLabel && AgeRanges[key].apiLabel === typicalAgeRange,
    );
  };

  const isSelectedAgeRange = (key: string, apiLabel: string): boolean => {
    if (!field.value?.typicalAgeRange) {
      return;
    }

    if (key === 'CUSTOM') {
      return isCustomAgeRange(field.value.typicalAgeRange);
    }

    return field.value.typicalAgeRange === apiLabel;
  };

  return (
    <Controller
      name="nameAndAge"
      control={control}
      render={({ field }) => {
        const [min, max] = (field.value?.typicalAgeRange ?? '').split('-');

        return (
          <Stack spacing={2}>
            <Text fontWeight="bold">{t(`create.step4.age.title`)}</Text>
            <Inline spacing={3} flexWrap="wrap" maxWidth="40rem">
              {Object.keys(AgeRanges).map((key) => {
                const apiLabel = AgeRanges[key].apiLabel;
                const isSelected = isSelectedAgeRange(key, apiLabel);
                return (
                  <Inline key={key}>
                    <Button
                      width="auto"
                      marginBottom={3}
                      display="inline-flex"
                      variant={
                        isSelected
                          ? ButtonVariants.SUCCESS
                          : ButtonVariants.SECONDARY
                      }
                      onClick={() => {
                        field.onChange({
                          ...field.value,
                          typicalAgeRange: key === 'CUSTOM' ? '0-99' : apiLabel,
                        });
                        onChange({
                          ...field.value,
                          typicalAgeRange: key === 'CUSTOM' ? '0-99' : apiLabel,
                        });
                      }}
                    >
                      {t(`create.step4.age.${key.toLowerCase()}`)}
                      <span
                        css={css`
                          color: ${getValue('rangeTextColor')};
                          font-size: 0.9rem;
                        `}
                      >
                        &nbsp; {AgeRanges[key].label ?? ''}
                      </span>
                    </Button>
                    {isSelected && key === 'CUSTOM' && (
                      <Inline width="100%">
                        <Stack>
                          <Text fontWeight="bold">Van</Text>
                          <Input
                            marginRight={3}
                            value={min}
                            placeholder="Van"
                            onChange={(event) => {
                              field.onChange({
                                ...field.value,
                                typicalAgeRange: `${
                                  (event.target as HTMLInputElement).value
                                }-${max ?? ''}`,
                              });
                            }}
                            onBlur={(event: FormEvent<HTMLInputElement>) => {
                              field.onChange({
                                ...field.value,
                                typicalAgeRange: `${
                                  (event.target as HTMLInputElement).value
                                }-${max ?? ''}`,
                              });
                              onChange({
                                ...field.value,
                                typicalAgeRange: `${
                                  (event.target as HTMLInputElement).value
                                }-${max ?? ''}`,
                              });
                            }}
                          />
                        </Stack>
                        <Stack>
                          <Text fontWeight="bold">Tot</Text>
                          <Input
                            marginRight={3}
                            value={max}
                            placeholder="Tot"
                            onChange={(event) => {
                              field.onChange({
                                ...field.value,
                                typicalAgeRange: `${min ?? 0}-${
                                  (event.target as HTMLInputElement).value
                                }`,
                              });
                            }}
                            onBlur={(event: FormEvent<HTMLInputElement>) => {
                              field.onChange({
                                ...field.value,
                                typicalAgeRange: `${min ?? 0}-${
                                  (event.target as HTMLInputElement).value
                                }`,
                              });
                              onChange({
                                ...field.value,
                                typicalAgeRange: `${min ?? 0}-${
                                  (event.target as HTMLInputElement).value
                                }`,
                              });
                            }}
                          />
                        </Stack>
                      </Inline>
                    )}
                  </Inline>
                );
              })}
            </Inline>
          </Stack>
        );
      }}
    />
  );
};

export { AgeRangeStep };
