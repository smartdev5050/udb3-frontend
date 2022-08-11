import { TFunction } from 'i18next';
import { useMemo } from 'react';
import type { FieldError, Path, UseFormReturn } from 'react-hook-form';
import { useTranslation, UseTranslationResponse } from 'react-i18next';

import type { BoxProps } from '@/ui/Box';
import { Box } from '@/ui/Box';
import type { StackProps } from '@/ui/Stack';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { Title } from '@/ui/Title';

import type { FormData as EventFormData } from '../create/EventForm';
import type { FormData as MovieFormData } from '../manage/movies/MovieForm';

type FormDataUnion = MovieFormData & EventFormData;

type StepsConfiguration<TFormData extends FormDataUnion> = {
  Component: any;
  defaultValue?: any;
  field?: Path<TFormData>;
  step?: number;
  title: (t: TFunction) => string;
  variant?: string;
  validation?: any;
  shouldShowStep?: (
    data: UseFormReturn<TFormData> & {
      eventId?: string;
    },
  ) => boolean;
  stepProps?: Record<string, unknown>;
};

type NumberIndicatorProps = {
  children: number;
} & BoxProps;

const NumberIndicator = ({ children, ...props }: NumberIndicatorProps) => {
  return (
    <Box
      borderRadius="50%"
      width="1.8rem"
      minWidth="1.8rem"
      height="1.8rem"
      minHeight="1.8rem"
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

type StepWrapperProps = StackProps & {
  title: string;
  stepNumber: number;
};

const StepWrapper = ({
  stepNumber,
  children,
  title,
  ...props
}: StepWrapperProps) => {
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
        <Text>{title}</Text>
      </Title>
      {children}
    </Stack>
  );
};

StepWrapper.defaultProps = {
  title: '',
};

const getValue = getValueFromTheme('createPage');

type StepProps<TFormData extends FormDataUnion> = Omit<
  UseFormReturn<TFormData>,
  'formState'
> & {
  formState: {
    errors: Record<keyof TFormData, FieldError>;
  };
} & {
  loading: boolean;
  field: Path<TFormData>;
  onChange: (value: any) => void;
};

type StepsProps<TFormData extends FormDataUnion> = {
  eventId?: string;
  form: UseFormReturn<TFormData>;
  fieldLoading?: string;
  onChange?: (editedField: string) => void;
  onChangeSuccess?: (editedField: string) => void;
  configurations: Array<StepsConfiguration<TFormData>>;
};

const Steps = <TFormData extends FormDataUnion>({
  onChange,
  configurations,
  fieldLoading,
  form,
  eventId,
  ...props
}: StepsProps<TFormData>) => {
  const { t } = useTranslation();

  const configurationsWithComponent = useMemo(
    () => configurations.filter(({ Component }) => !!Component),
    [configurations],
  );

  const showStep = ({ field, index }) => {
    // don't hide steps that were visible before
    if (form.getFieldState(field).isTouched) return true;

    return (
      configurationsWithComponent[index]?.shouldShowStep?.({
        ...form,
        eventId,
      }) ?? false
    );
  };

  return (
    <Stack spacing={5} width="100%">
      {configurationsWithComponent.map(
        (
          {
            Component: Step,
            field,
            stepProps = {},
            variant,
            step,
            title: getTitle,
          },
          index: number,
        ) => {
          if (!showStep({ field, index })) {
            return null;
          }

          const stepNumber = step ?? index + 1;

          return (
            <StepWrapper
              stepNumber={stepNumber}
              key={`step${stepNumber}`}
              title={getTitle(t)}
            >
              <Step<TFormData>
                key={index}
                onChange={() => onChange(field)}
                loading={!!(field && fieldLoading === field)}
                field={field}
                eventId={eventId}
                variant={variant}
                {...form}
                {...props}
                {...stepProps}
              />
            </StepWrapper>
          );
        },
      )}
    </Stack>
  );
};

Steps.defaultProps = {
  onChange: () => {},
  fieldLoading: '',
};

export { Steps };
export type { FormDataUnion, StepProps, StepsConfiguration };
