import { TFunction } from 'i18next';
import type { FieldError, Path, UseFormReturn } from 'react-hook-form';
import { useTranslation, UseTranslationResponse } from 'react-i18next';

import type { BoxProps } from '@/ui/Box';
import { Box } from '@/ui/Box';
import type { StackProps } from '@/ui/Stack';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { Title } from '@/ui/Title';

import type { FormData as MovieFormData } from '../manage/movies/MovieForm';

type FormDataIntersection = Partial<MovieFormData>;

type StepsConfiguration<TFormData extends FormDataIntersection> = Array<{
  Component: any;
  field?: Path<TFormData>;
  step?: number;
  title: (t: TFunction) => string;
  variant?: string;
  shouldShowNextStep?: (
    data: UseFormReturn<TFormData> & {
      eventId?: string;
    },
  ) => boolean;
  stepProps?: Record<string, unknown>;
}>;

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

const getValue = getValueFromTheme('createPage');

type StepProps<TFormData extends FormDataIntersection> = Omit<
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

type StepsProps<TFormData extends FormDataIntersection> = {
  eventId?: string;
  form: UseFormReturn<TFormData>;
  fieldLoading?: string;
  onChange?: (editedField: string) => void;
  onChangeSuccess?: (editedField: string) => void;
  configuration: StepsConfiguration<TFormData>;
};

const Steps = <TFormData extends FormDataIntersection>({
  onChange,
  configuration,
  fieldLoading,
  form,
  eventId,
  ...props
}: StepsProps<TFormData>) => {
  const { t } = useTranslation();

  const showStep = ({ field, index }) => {
    // when there is an eventId, we're in edit mode, show all steps
    if (!!eventId) return true;

    // don't hide steps that were visible before
    if (Object.keys(form.getValues()).includes(field)) return true;

    // no shouldShowNextStep function = show the step
    return (
      configuration[index - 1]?.shouldShowNextStep?.({
        ...form,
        eventId,
      }) ?? true
    );
  };

  return (
    <Stack spacing={5}>
      {configuration.map(
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
export type { FormDataIntersection, StepProps, StepsConfiguration };
