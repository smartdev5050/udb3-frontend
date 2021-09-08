import { useTranslation } from 'react-i18next';

import type { BoxProps } from '@/ui/Box';
import { Box } from '@/ui/Box';
import type { StackProps } from '@/ui/Stack';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { Title } from '@/ui/Title';

type StepProps = StackProps & { stepNumber: number };

type NumberIndicatorProps = {
  children: number;
} & BoxProps;

const getValue = getValueFromTheme('moviesCreatePage');

const NumberIndicator = ({ children, ...props }: NumberIndicatorProps) => {
  return (
    <Box
      borderRadius="50%"
      width="1.8rem"
      height="1.8rem"
      lineHeight="1.8rem"
      backgroundColor={getValue('stepNumber.backgroundColor')}
      padding={0}
      fontSize="1rem"
      fontWeight="bold"
      color="white"
      textAlign="center"
      {...props}
    >
      {children}
    </Box>
  );
};

const Step = ({ stepNumber, children, ...props }: StepProps) => {
  const { t } = useTranslation();

  return (
    <Stack spacing={4} {...getStackProps(props)}>
      <Title
        color={getValue('title.color')}
        lineHeight="220%"
        alignItems="center"
        spacing={3}
        css={`
          border-bottom: 1px solid ${getValue('title.borderColor')};
        `}
      >
        <NumberIndicator>{stepNumber}</NumberIndicator>
        <Text>{t(`movies.create.step${stepNumber}_title`)}</Text>
      </Title>
      {children}
    </Stack>
  );
};

export { Step };

export type { StepProps };
