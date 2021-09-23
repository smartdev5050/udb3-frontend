import type { Values } from '@/types/Values';

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
    labelPosition: Values<typeof LabelPositions>;
    info?: string;
    required?: boolean;
  };

const InputWithLabel = ({
  type,
  id,
  label,
  placeholder,
  className,
  onChange,
  labelPosition,
  info,
  required,
  ...props
}: Props) => {
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
      <Stack>
        <Input
          type={type}
          id={id}
          placeholder={placeholder}
          onChange={onChange}
        />
        {info && <Text variant={TextVariants.MUTED}>{info}</Text>}
      </Stack>
    </Wrapper>
  );
};

InputWithLabel.defaultProps = {
  type: 'text',
  labelPosition: LabelPositions.TOP,
  required: false,
};

export { InputWithLabel, LabelPositions };
