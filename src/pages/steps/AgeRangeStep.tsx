import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import { Button, ButtonVariants } from '@/ui/Button';
import { Inline } from '@/ui/Inline';
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

const AgeRangeStep = () => {
  const { t } = useTranslation();

  const getAgeRangeLabel = (key: string): string => {
    if (
      typeof AgeRanges[key].min === 'number' &&
      typeof AgeRanges[key].max === 'number'
    ) {
      return ` ${AgeRanges[key].min}-${AgeRanges[key].max}`;
    }
    if (typeof AgeRanges[key].min === 'number') {
      return ` ${AgeRanges[key].min}+`;
    }
    return '';
  };

  return (
    <Stack spacing={2}>
      <Text fontWeight="bold">{t(`create.step4.age.title`)}</Text>
      <Inline spacing={3} flexWrap="wrap" maxWidth="40rem">
        {Object.keys(AgeRanges).map((key) => {
          return (
            <Button
              width="auto"
              marginBottom={3}
              display="inline-flex"
              key={key}
              variant={ButtonVariants.SECONDARY}
              onClick={() => {
                console.log('hanldeOnClick');
              }}
            >
              {t(`create.step4.age.${key.toLowerCase()}`)}
              <span
                css={css`
                  color: ${getValue('rangeTextColor')};
                  font-size: 0.9rem;
                `}
              >
                {getAgeRangeLabel(key)}
              </span>
            </Button>
          );
        })}
      </Inline>
    </Stack>
  );
};

export { AgeRangeStep };
