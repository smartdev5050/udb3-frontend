import { TFunction } from 'i18next';
import pick from 'lodash/pick';
import { useMemo } from 'react';
import type {
  ControllerRenderProps,
  DefaultValues,
  Path,
  UseFormReturn,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { OfferType, OfferTypes } from '@/constants/OfferType';
import { Values } from '@/types/Values';
import type { BoxProps } from '@/ui/Box';
import { Box } from '@/ui/Box';
import type { StackProps } from '@/ui/Stack';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { Title } from '@/ui/Title';

import type { FormData as OfferFormData } from '../create/OfferForm';
import type { FormData as MovieFormData } from '../manage/movies/MovieForm';

type FormDataUnion = MovieFormData & OfferFormData;

type Field = ControllerRenderProps<FormDataUnion, Path<FormDataUnion>>;

type StepsConfiguration<
  TName extends keyof FormDataUnion = keyof FormDataUnion,
> = {
  Component: any;
  name?: TName;
  defaultValue?: DefaultValues<FormDataUnion>[TName];
  step?: number;
  title: (
    data: { t: TFunction; scope: OfferType } & UseFormReturn<
      FormDataUnion,
      any
    >,
  ) => string;
  variant?: string;
  validation?: any;
  shouldShowStep?: (
    data: UseFormReturn<FormDataUnion> & {
      offerId?: string;
      scope?: OfferType;
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

type StepProps = UseFormReturn<FormDataUnion> & {
  loading: boolean;
  name: Path<FormDataUnion>;
  onChange: (value: any) => void;
};

type StepsProps = {
  scope?: OfferType;
  offerId?: string;
  form: UseFormReturn<FormDataUnion>;
  fieldLoading?: string;
  onChange?: (editedField: string) => void;
  onChangeSuccess?: (editedField: string) => void;
  configurations: Array<StepsConfiguration>;
};

type UnknownProps = {
  [key: string]: any;
};

const stepPropKeys: (keyof StepProps)[] = [
  'clearErrors',
  'control',
  'formState',
  'getFieldState',
  'getValues',
  'handleSubmit',
  'loading',
  'name',
  'onChange',
  'register',
  'reset',
  'resetField',
  'setError',
  'setFocus',
  'setValue',
  'trigger',
  'unregister',
  'watch',
];

const getStepProps = (props: UnknownProps) => pick(props, stepPropKeys);

const Steps = ({
  onChange,
  configurations,
  fieldLoading,
  form,
  offerId,
  scope,
  ...props
}: StepsProps) => {
  const { t } = useTranslation();

  const configurationsWithComponent = useMemo(
    () => configurations.filter(({ Component }) => !!Component),
    [configurations],
  );

  const showStep = ({ name, index }) => {
    // don't hide steps that were visible before
    if (form.getFieldState(name).isTouched) return true;

    const shouldShowStep = configurationsWithComponent[index]?.shouldShowStep?.(
      {
        ...form,
        offerId,
        scope,
      },
    );

    return shouldShowStep ?? false;
  };

  return (
    <Stack spacing={5} width="100%">
      {configurationsWithComponent.map(
        (
          {
            Component: Step,
            name,
            stepProps = {},
            variant,
            step,
            title: getTitle,
          },
          index: number,
        ) => {
          if (!showStep({ name, index })) {
            return null;
          }

          const stepNumber = step ?? index + 1;

          return (
            <StepWrapper
              stepNumber={stepNumber}
              key={`step${stepNumber}`}
              title={getTitle({ ...form, t, scope })}
            >
              <Step
                key={index}
                onChange={() => onChange(name)}
                loading={!!(name && fieldLoading === name)}
                name={name}
                offerId={offerId}
                scope={scope}
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

export { getStepProps, Steps };
export type { Field, FormDataUnion, StepProps, StepsConfiguration };
