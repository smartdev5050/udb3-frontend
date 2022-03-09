import type { Path, UseFormReturn } from 'react-hook-form';

import type { BoxProps } from '@/ui/Box';
import { Box } from '@/ui/Box';
import type { StackProps } from '@/ui/Stack';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { Title } from '@/ui/Title';

// type Keys<T> = keyof T & string;

type StepsConfiguration<T> = Array<{
  Component: any;
  field?: Path<T>;
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

type StepWrapperProps = StackProps & { title: string; stepNumber: number };

const StepWrapper = ({
  stepNumber,
  children,
  title,
  ...props
}: StepWrapperProps) => {
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

type StepProps<T> = UseFormReturn<T> & {
  loading: boolean;
  field: Path<T>;
  onChange: (value: any) => void;
};

type StepsProps<T> = UseFormReturn<T> & {
  mode: 'UPDATE' | 'CREATE';
  fieldLoading?: string;
  onChange?: (value: string, field: string) => void;
  configuration: StepsConfiguration<T>;
};

const Steps = <T extends unknown>({
  mode,
  onChange,
  configuration,
  fieldLoading,
  ...props
}: StepsProps<T>) => {
  const keys = Object.keys(props.getValues());

  return (
    <Stack spacing={5}>
      {configuration.map(
        (
          { Component: Step, field, additionalProps = {}, step, title },
          index: number,
        ) => {
          const shouldShowNextStep =
            configuration[index - 1]?.shouldShowNextStep ?? true;

          if (
            !keys.includes(field) &&
            !shouldShowNextStep &&
            mode !== 'UPDATE'
          ) {
            return null;
          }

          const stepNumber = step ?? index + 1;

          return (
            <StepWrapper
              stepNumber={stepNumber}
              key={`step${stepNumber}`}
              title={title}
            >
              <Step<T>
                key={index}
                onChange={(value) => onChange(field, value)}
                loading={!!(field && fieldLoading === field)}
                field={field}
                {...props}
                {...additionalProps}
              />
            </StepWrapper>
          );
        },
      )}
    </Stack>
  );
};

Steps.defaultProps = {
  mode: 'CREATE',
  onChange: () => {},
  fieldLoading: '',
};

export { Steps };
export type { StepProps, StepsConfiguration };
