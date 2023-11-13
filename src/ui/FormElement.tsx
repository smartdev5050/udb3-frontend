import type { ReactNode, Ref } from 'react';
import { cloneElement } from 'react';

import type { Values } from '@/types/Values';

import { getInlineProps, Inline, InlineProps } from './Inline';
import { Label, LabelPositions, LabelVariants } from './Label';
import { Spinner, SpinnerSizes } from './Spinner';
import type { StackProps } from './Stack';
import { getStackProps, Stack } from './Stack';
import { Text, TextVariants } from './Text';

type Props = {
  id: string;
  ref?: Ref<HTMLElement>;
  label?: ReactNode;
  labelPosition?: Values<typeof LabelPositions>;
  labelVariant?: Values<typeof LabelVariants>;
  error?: string;
  info?: ReactNode;
  loading?: boolean;
  Component: ReactNode;
} & StackProps;

const FormElement = ({
  id,
  ref,
  label,
  labelPosition,
  labelVariant,
  error,
  info,
  loading,
  Component,
  className,
  ...props
}: Props) => {
  const Wrapper = labelPosition === LabelPositions.TOP ? Stack : Inline;

  // @ts-expect-error
  const clonedComponent = cloneElement(Component, {
    // @ts-expect-error
    ...Component.props,
    id,
    ref,
  });

  const wrapperProps: { [key: string]: InlineProps | StackProps } = {
    [LabelPositions.TOP]: {
      alignItems: 'flex-start',
      spacing: 2,
      ...getStackProps(props),
    },
    [LabelPositions.LEFT]: {
      alignItems: 'center',
      spacing: 3,
      ...getInlineProps(props),
    },
    [LabelPositions.RIGHT]: {
      alignItems: 'center',
      flexDirection: 'row-reverse',
      justifyContent: 'flex-end',
      spacing: 3,
      ...getInlineProps(props),
    },
  };

  return (
    <Wrapper
      as="div"
      className={className}
      {...(wrapperProps[labelPosition] ?? {})}
    >
      {label && (
        <Label
          variant={labelVariant}
          htmlFor={id}
          {...(labelPosition !== LabelPositions.TOP
            ? { height: '36px', alignItems: 'center' }
            : {})}
          flexShrink={0}
        >
          {label}
        </Label>
      )}
      <Stack
        as="div"
        spacing={3}
        width={labelPosition === LabelPositions.RIGHT ? 'auto' : '100%'}
        minWidth={50}
      >
        <Stack as="div">
          <Inline as="div" alignItems="center">
            {clonedComponent}
            {loading && (
              <Spinner size={SpinnerSizes.SMALL} width="auto" padding={3} />
            )}
          </Inline>
          {error && <Text variant={TextVariants.ERROR}>{error}</Text>}
        </Stack>
        {info &&
          (typeof info === 'string' ? (
            <Text variant={TextVariants.MUTED}>{info}</Text>
          ) : (
            info
          ))}
      </Stack>
    </Wrapper>
  );
};

FormElement.defaultProps = {
  labelPosition: LabelPositions.TOP,
  labelVariant: LabelVariants.BOLD,
  loading: false,
};

export { FormElement };
