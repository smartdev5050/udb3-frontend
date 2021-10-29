import type { ReactNode } from 'react';
import { cloneElement } from 'react';

import type { Values } from '@/types/Values';

import { getInlineProps, Inline } from './Inline';
import { Label, LabelVariants } from './Label';
import type { StackProps } from './Stack';
import { getStackProps, Stack } from './Stack';
import { Text, TextVariants } from './Text';

const LabelPositions = {
  LEFT: 'left',
  TOP: 'top',
} as const;

type Props = {
  id: string;
  ref: any;
  label?: string;
  labelPosition?: Values<typeof LabelPositions>;
  error?: string;
  info?: string;
  Component: ReactNode;
} & StackProps;

const FormElement = ({
  id,
  ref,
  label,
  labelPosition,
  error,
  info,
  Component,
  ...props
}: Props) => {
  const Wrapper = labelPosition === LabelPositions.LEFT ? Inline : Stack;
  const wrapperProps =
    labelPosition === LabelPositions.LEFT
      ? { ...getInlineProps(props), spacing: 3, alignItems: 'flex-start' }
      : { ...getStackProps(props), spacing: 2 };

  // @ts-expect-error
  const clonedComponent = cloneElement(Component, {
    // @ts-expect-error
    ...Component.props,
    id,
    ref,
  });

  return (
    <Wrapper as="div" spacing={2} {...wrapperProps}>
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
      <Stack spacing={3} flex={1}>
        <Stack>
          {clonedComponent}
          {error && <Text variant={TextVariants.ERROR}>{error}</Text>}
        </Stack>
        {info && <Text variant={TextVariants.MUTED}>{info}</Text>}
      </Stack>
    </Wrapper>
  );
};

FormElement.defaultProps = {
  labelPosition: LabelPositions.TOP,
};

export { FormElement, LabelPositions };
