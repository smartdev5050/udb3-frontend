import type { ReactNode, Ref } from 'react';
import { forwardRef } from 'react';

import type { Values } from '@/types/Values';
import { Alert, AlertVariants } from '@/ui/Alert';

import type { InlineProps } from './Inline';
import { getInlineProps, Inline } from './Inline';
import type { InputProps } from './Input';
import { Input } from './Input';
import { Label, LabelVariants } from './Label';
import { getStackProps, Stack } from './Stack';
import { Text, TextVariants } from './Text';

const LabelPositions = {
  LEFT: 'left',
  TOP: 'top',
} as const;

type Props = InlineProps &
  InputProps & {
    label: string;
    labelPosition?: Values<typeof LabelPositions>;
    info?: ReactNode;
    required?: boolean;
    ref?: Ref<HTMLInputElement>;
    error?: string;
    name: string;
  };

const InputWithLabel = forwardRef(
  (
    {
      name,
      type,
      id,
      label,
      placeholder,
      defaultValue,
      className,
      onChange,
      onBlur,
      labelPosition,
      info,
      required,
      error,
      ...props
    }: Props,
    ref,
  ) => {
    const Wrapper = labelPosition === LabelPositions.LEFT ? Inline : Stack;
    const wrapperProps =
      labelPosition === LabelPositions.LEFT
        ? { ...getInlineProps(props), spacing: 3 }
        : { ...getStackProps(props), spacing: 2 };

    return (
      <Wrapper className={className} as="div" {...wrapperProps}>
        <Label
          htmlFor={id}
          variant={LabelVariants.BOLD}
          {...(labelPosition === LabelPositions.LEFT
            ? { height: '36px', alignItems: 'center' }
            : {})}
          required={required}
        >
          <Text>{label}</Text>
        </Label>
        <Stack spacing={3}>
          <Stack>
            <Input
              name={name}
              type={type}
              id={id}
              placeholder={placeholder}
              ref={ref}
              onChange={onChange}
              onBlur={onBlur}
              isInvalid={!!error}
              defaultValue={defaultValue}
            />
            {error && <Text color="red">{error}</Text>}
          </Stack>
          {info && <Text variant={TextVariants.MUTED}>{info}</Text>}
        </Stack>
      </Wrapper>
    );
  },
);

InputWithLabel.defaultProps = {
  type: 'text',
  labelPosition: LabelPositions.TOP,
  required: false,
};

export { InputWithLabel, LabelPositions };
