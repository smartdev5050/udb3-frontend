import type { ReactNode, Ref } from 'react';
import { cloneElement } from 'react';

import type { Values } from '@/types/Values';

import { getInlineProps, Inline } from './Inline';
import { Label, LabelPositions, LabelVariants } from './Label';
import { Spinner, SpinnerSizes } from './Spinner';
import type { StackProps } from './Stack';
import { getStackProps, Stack } from './Stack';
import { Text, TextVariants } from './Text';

type Props = {
  id: string;
  ref?: Ref<HTMLElement>;
  label?: string;
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
  ...props
}: Props) => {
  const Wrapper = labelPosition === LabelPositions.LEFT ? Inline : Stack;
  const wrapperProps =
    labelPosition === LabelPositions.LEFT
      ? { ...getInlineProps(props), spacing: 3 }
      : { ...getStackProps(props), spacing: 2 };

  // @ts-expect-error
  const clonedComponent = cloneElement(Component, {
    // @ts-expect-error
    ...Component.props,
    id,
    ref,
  });

  return (
    <Wrapper
      as="div"
      alignItems={
        labelPosition === LabelPositions.LEFT ? 'center' : 'flex-start'
      }
      {...wrapperProps}
    >
      {label && (
        <Label
          variant={labelVariant}
          htmlFor={id}
          {...(labelPosition === LabelPositions.LEFT
            ? { height: '36px', alignItems: 'center' }
            : {})}
          flexShrink={0}
        >
          {label}
        </Label>
      )}
      <Stack as="div" spacing={3} width="100%">
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
