import { forwardRef } from 'react';

import { Label, LabelVariants } from './Label';
import type { StackProps } from './Stack';
import { getStackProps, Stack } from './Stack';
import type { TextAreaProps } from './TextArea';
import { TextArea } from './TextArea';

type Props = Omit<StackProps, 'onChange'> &
  TextAreaProps & { label: string; id: string };

const TextAreaWithLabel = forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      label,
      className,
      onInput,
      disabled,
      rows,
      onChange,
      value,
      name,
      ...props
    }: Props,
    ref,
  ) => {
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
          onChange={onChange}
          value={value}
          disabled={disabled}
          ref={ref}
          name={name}
        />
      </Stack>
    );
  },
);

TextAreaWithLabel.displayName = 'TextAreaWithLabel';

export { TextAreaWithLabel };
