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
  error?: string;
  info?: string;
  loading?: boolean;
  Component: ReactNode;
} & StackProps;

const FormElement = ({
  id,
  ref,
  label,
  labelPosition,
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
    <Wrapper as="div" spacing={2} alignItems="flex-start" {...wrapperProps}>
      {label && (
        <Label
          variant={LabelVariants.BOLD}
          htmlFor={id}
          {...(labelPosition === LabelPositions.LEFT
            ? { height: '36px', alignItems: 'center' }
            : {})}
        >
          {label}
        </Label>
      )}
      <Stack as="div" spacing={3} width="100%">
        <Stack as="div">
          <Inline as="div" alignItems="center">
            {clonedComponent}
            {loading ? (
              <Spinner size={SpinnerSizes.SMALL} width="auto" padding={3} />
            ) : null}
          </Inline>
          {error && <Text variant={TextVariants.ERROR}>{error}</Text>}
        </Stack>
        {info && <Text variant={TextVariants.MUTED}>{info}</Text>}
      </Stack>
    </Wrapper>
  );
};

FormElement.defaultProps = {
  labelPosition: LabelPositions.TOP,
  loading: false,
};

export { FormElement };
