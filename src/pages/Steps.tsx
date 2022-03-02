import type { BoxProps } from '@/ui/Box';
import { Box } from '@/ui/Box';
import type { StackProps } from '@/ui/Stack';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { Title } from '@/ui/Title';

type StepProps = StackProps & { title: string; stepNumber: number };

type StepsConfiguration = Array<{
  Component: any;
  inputKey?: string;
  step?: number;
  title: string;
  shouldShowNextStep?: boolean;
  additionalProps?: { [key: string]: unknown };
}>;

type NumberIndicatorProps = {
  children: number;
} & BoxProps;

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

const StepWrapper = ({ stepNumber, children, title, ...props }: StepProps) => {
  return (
    <Stack spacing={4} width="100%" {...getStackProps(props)}>
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
        <Text>{title}</Text>
      </Title>
      {children}
    </Stack>
  );
};

StepWrapper.defaultProps = {
  title: '',
};

const getValue = getValueFromTheme('moviesCreatePage');

type StepsProps = {
  errors: any;
  control: any;
  getValues: any;
  register: any;
  isInEditMode: boolean;
  fieldLoading: string;
  onChange: (value: string, field: string) => void;
  configuration: StepsConfiguration;
};

const Steps = ({
  errors,
  control,
  getValues,
  register,
  isInEditMode,
  onChange,
  configuration,
  fieldLoading,
}: StepsProps) => {
  return (
    <Stack spacing={5}>
      {configuration.map(
        (
          { Component: Step, inputKey, additionalProps = {}, step, title },
          index: number,
        ) => {
          const shouldShowNextStep =
            configuration[index - 1]?.shouldShowNextStep ?? true;

          if (!shouldShowNextStep && !isInEditMode) return null;

          const stepNumber = step ?? index + 1;

          return (
            <StepWrapper
              stepNumber={stepNumber}
              key={`step${stepNumber}`}
              title={title}
            >
              <Step
                errors={errors}
                control={control}
                onChange={(value) => onChange(inputKey, value)}
                getValues={getValues}
                register={register}
                key={index}
                loading={!!(inputKey && fieldLoading === inputKey)}
                {...additionalProps}
              />
            </StepWrapper>
          );
        },
      )}
    </Stack>
  );
};

export { Steps };
export type { StepProps, StepsConfiguration };
