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
  ALL: {},
  TODDLERS: { min: 0, max: 2 },
  PRESCHOOLERS: { min: 3, max: 5 },
  KIDS: { min: 6, max: 11 },
  TEENAGERS: { min: 12, max: 15 },
  YOUNGSTERS: { min: 16, max: 26 },
  ADULTS: { min: 18 },
  SENIORS: { min: 65 },
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

  const getAgeRangeLabel = (key: string): string => {
    if (
      typeof AgeRanges[key].min === 'number' &&
      typeof AgeRanges[key].max === 'number'
    ) {
      return `${AgeRanges[key].min}-${AgeRanges[key].max}`;
    }
    if (typeof AgeRanges[key].min === 'number') {
      return `${AgeRanges[key].min}+`;
    }
    return '';
  };

  const ageRangeLabelToApiFormat = (label: string) => {
    if (!label) return '-';
    return label.replace('+', '-');
  };

  const isCustomAgeRange = (typicalAgeRange: string): boolean => {
    const [min, max] = typicalAgeRange.split('-');
    return Object.keys(AgeRanges).some(
      (key) => !(AgeRanges[key].min === min && AgeRanges[key].max === max),
    );
  };

  const isSelectedAgeRange = (key: string, ageRangeLabel: string): boolean => {
    if (!field.value?.typicalAgeRange) {
      return;
    }

    if (key === 'CUSTOM' && isCustomAgeRange(field.value.typicalAgeRange)) {
      return true;
    }
    return (
      field.value.typicalAgeRange === ageRangeLabelToApiFormat(ageRangeLabel)
    );
  };

  return (
    //TODO: Handle custom ranges
    <Controller
      name="nameAndAge"
      control={control}
      render={({ field }) => {
        return (
          <Stack spacing={2}>
            <Text fontWeight="bold">{t(`create.step4.age.title`)}</Text>
            <Inline spacing={3} flexWrap="wrap" maxWidth="40rem">
              {Object.keys(AgeRanges).map((key) => {
                const [min, max] = field.value.typicalAgeRange.split('-');
                const ageRangeLabel = getAgeRangeLabel(key);
                const isSelected = isSelectedAgeRange(key, ageRangeLabel);
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
                          typicalAgeRange: ageRangeLabelToApiFormat(
                            ageRangeLabel,
                          ),
                        });
                        onChange({
                          ...field.value,
                          typicalAgeRange: ageRangeLabelToApiFormat(
                            ageRangeLabel,
                          ),
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
                        &nbsp;{ageRangeLabel}
                      </span>
                    </Button>
                    {isSelected && key === 'CUSTOM' && (
                      <Inline flex="2">
                        <Stack>
                          <Text fontWeight="bold">Van</Text>
                          <Input
                            marginRight={3}
                            value={min}
                            placeholder="Van"
                          />
                        </Stack>
                        <Stack>
                          <Text fontWeight="bold">Tot</Text>
                          <Input
                            marginRight={3}
                            value={max}
                            placeholder="Tot"
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
