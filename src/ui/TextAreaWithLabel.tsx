import { Label, LabelVariants } from './Label';
import type { StackProps } from './Stack';
import { getStackProps, Stack } from './Stack';
import type { TextAreaProps } from './TextArea';
import { TextArea } from './TextArea';

type Props = StackProps & TextAreaProps & { label: string; id: string };

const TextAreaWithLabel = ({
  id,
  label,
  className,
  onInput,
  value,
  disabled,
  rows,
  ...props
}: Props) => {
  return (
    <Stack
      as="div"
      spacing={2}
      className={className}
      flex={1}
      {...getStackProps(props)}
    >
      <Label htmlFor={id} variant={LabelVariants.BOLD}>
        {label}
      </Label>
      <TextArea
        id={id}
        rows={rows}
        onInput={onInput}
        value={value}
        disabled={disabled}
      />
    </Stack>
  );
};

export { TextAreaWithLabel };
