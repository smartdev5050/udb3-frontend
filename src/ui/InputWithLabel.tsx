import type { Values } from '@/types/Values';

import type { InlineProps } from './Inline';
import { getInlineProps, Inline } from './Inline';
import type { InputProps } from './Input';
import { Input } from './Input';
import { Label, LabelVariants } from './Label';
import { getStackProps, Stack } from './Stack';

const LabelPositions = {
  LEFT: 'left',
  TOP: 'top',
} as const;

type Props = InlineProps &
  InputProps & {
    label: string;
    labelPosition: Values<typeof LabelPositions>;
  };

const InputWithLabel = ({
  type,
  id,
  label,
  placeholder,
  className,
  onChange,
  labelPosition,
  ...props
}: Props) => {
  const Wrapper = labelPosition === LabelPositions.LEFT ? Inline : Stack;
  const wrapperProps =
    labelPosition === LabelPositions.LEFT
      ? { ...getInlineProps(props), alignItems: 'center', spacing: 3 }
      : { ...getStackProps(props), spacing: 2 };

  return (
    <Wrapper className={className} as="div" {...wrapperProps}>
      <Label htmlFor={id} variant={LabelVariants.BOLD}>
        {label}
      </Label>
      <Input
        type={type}
        id={id}
        placeholder={placeholder}
        onChange={onChange}
      />
    </Wrapper>
  );
};

InputWithLabel.defaultProps = {
  type: 'text',
  labelPosition: LabelPositions.TOP,
};

export { InputWithLabel, LabelPositions };
