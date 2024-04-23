import type { ReactNode, Ref } from 'react';
import { cloneElement } from 'react';

import type { Values } from '@/types/Values';
import { parseSpacing } from '@/ui/Box';

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
  maxLength?: number;
  Component: ReactNode;
} & StackProps;

const MaxLengthCounter = ({
  currentLength,
  maxLength,
}: {
  currentLength: number;
  maxLength: number;
}) => (
  <Text
    variant={TextVariants.MUTED}
    fontSize="0.9rem"
    className="text-right"
    maxWidth="43rem"
    color={currentLength >= maxLength ? 'red' : 'inherit'}
  >
    {currentLength} / {maxLength}
  </Text>
);

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
  maxLength,
  ...props
}: Props) => {
  const Wrapper = labelPosition === LabelPositions.TOP ? Stack : Inline;

  // @ts-expect-error
  const clonedComponent = cloneElement(Component, {
    // @ts-expect-error
    ...Component.props,
    id,
    ref,
    maxLength,
  });

  const currentLength = clonedComponent.props?.value?.length ?? 0;
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

  const infoElement =
    typeof info === 'string' ? (
      <Text
        variant={TextVariants.MUTED}
        dangerouslySetInnerHTML={{ __html: info }}
        maxWidth={parseSpacing(9)}
        css={`
          strong {
            font-weight: bold;
          }
        `}
      />
    ) : (
      info
    );

  const labelElement = (
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
  );

  return (
    <Wrapper
      as="div"
      className={className}
      {...(wrapperProps[labelPosition] ?? {})}
    >
      {label && labelPosition !== LabelPositions.TOP && labelElement}
      <Stack
        as="div"
        spacing={3}
        width={labelPosition === LabelPositions.RIGHT ? 'auto' : '100%'}
        minWidth={50}
      >
        {(labelPosition === LabelPositions.TOP ||
          typeof maxLength !== 'undefined') && (
          <Inline justifyContent="space-between" maxWidth="43rem">
            <span>
              {label && labelPosition === LabelPositions.TOP && labelElement}
            </span>
            {typeof maxLength !== 'undefined' && (
              <MaxLengthCounter
                currentLength={currentLength}
                maxLength={maxLength}
              />
            )}
          </Inline>
        )}
        <Stack as="div">
          <Inline as="div" alignItems="center">
            {clonedComponent}
            {loading && (
              <Spinner size={SpinnerSizes.SMALL} width="auto" padding={3} />
            )}
          </Inline>
          {error && <Text variant={TextVariants.ERROR}>{error}</Text>}
        </Stack>
        {info && infoElement}
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
