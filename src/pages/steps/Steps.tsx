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

import { Scope } from '@/constants/OfferType';
import { SupportedLanguage } from '@/i18n/index';
import type { BoxProps } from '@/ui/Box';
import { Box } from '@/ui/Box';
import type { StackProps } from '@/ui/Stack';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getGlobalBorderRadius, getValueFromTheme } from '@/ui/theme';
import { Title } from '@/ui/Title';

import type { FormData as OfferFormData } from '../create/OfferForm';
import type { FormData as MovieFormData } from '../manage/movies/MovieForm';

type OrganizerForm = {
  nameAndUrl: {
    name: string;
    url: string;
    isContactUrl: boolean;
  };
};

type FormDataUnion = MovieFormData & OfferFormData & OrganizerForm;

type Field = ControllerRenderProps<FormDataUnion, Path<FormDataUnion>>;

type StepsConfiguration<
  TName extends keyof FormDataUnion = keyof FormDataUnion,
> = {
  Component: any;
  name?: TName;
  defaultValue?: DefaultValues<FormDataUnion>[TName];
  step?: number;
  title: (
    data: { t: TFunction; scope: Scope } & UseFormReturn<FormDataUnion, any>,
  ) => string;
  variant?: string;
  validation?: any;
  shouldShowStep?: (
    data: UseFormReturn<FormDataUnion> & {
      offerId?: string;
      scope?: Scope;
    },
  ) => boolean;
  stepProps?: Record<string, unknown>;
  offerId?: string;
  labels?: string[];
};

type NumberIndicatorProps = {
  children: number;
} & BoxProps;

const NumberIndicator = ({ children, ...props }: NumberIndicatorProps) => {
  return (
    <Box
      borderRadius={getGlobalBorderRadius}
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
    <Stack
      paddingX={5}
      paddingY={4.5}
      borderRadius={getGlobalBorderRadius}
      backgroundColor="white"
      css={`
        box-shadow: ${getGlobalValue('boxShadow.medium')};
      `}
      spacing={4}
      {...getStackProps(props)}
    >
      <Title color={getValue('title.color')} alignItems="center" spacing={3}>
        <NumberIndicator>{stepNumber}</NumberIndicator>
        <Text lineHeight="1rem">{title}</Text>
      </Title>
      {children}
    </Stack>
  );
};

StepWrapper.defaultProps = {
  title: '',
};

const getValue = getValueFromTheme('createPage');
const getGlobalValue = getValueFromTheme('global');

type StepProps = UseFormReturn<FormDataUnion> & {
  scope: Scope;
  offerId?: string;
  loading: boolean;
  name: Path<FormDataUnion>;
  onChange: (value: any) => void;
  mainLanguage: SupportedLanguage;
};

type StepsProps = {
  scope?: Scope;
  offerId?: string;
  labels?: string[];
  mainLanguage: SupportedLanguage;
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
  'mainLanguage',
  'resetField',
  'setError',
  'setFocus',
  'setValue',
  'trigger',
  'unregister',
  'watch',
  'scope',
  'offerId',
];

const getStepProps = (props: UnknownProps) => pick(props, stepPropKeys);

const Steps = ({
  onChange,
  configurations,
  fieldLoading,
  form,
  offerId,
  mainLanguage,
  scope,
  labels,
  ...props
}: StepsProps) => {
  const { t } = useTranslation();

  const configurationsWithComponent = useMemo(
    () => configurations.filter(({ Component }) => !!Component),
    [configurations],
  );

  const showStep = ({ name, index }) => {
    if (offerId) return true;

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
    <Stack spacing={5} width="100%" {...getStackProps(props)}>
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
                onChange={() => {
                  if (!form.formState.dirtyFields[name]) {
                    return;
                  }

                  onChange(name);
                }}
                loading={!!(name && fieldLoading === name)}
                name={name}
                offerId={offerId}
                mainLanguage={mainLanguage}
                scope={scope}
                labels={labels}
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
