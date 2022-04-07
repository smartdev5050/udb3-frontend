import { ReactNode } from 'react';

import { BoxProps } from './Box';
import { getInlineProps, Inline } from './Inline';
import { Label } from './Label';
import type { RadioButtonProps } from './RadioButton';
import { RadioButton } from './RadioButton';
import { Stack } from './Stack';
import { Text, TextVariants } from './Text';

type Props = RadioButtonProps &
  BoxProps & {
    info?: string;
    label?: ReactNode;
  };

const RadioButtonWithLabel = ({
  id,
  name,
  disabled,
  onChange,
  label,
  info,
  value,
  className,
  ...props
}: Props) => {
  return (
    <Inline
      className={className}
      alignItems={info ? 'flex-start' : 'center'}
      spacing={3}
      as="li"
      {...getInlineProps(props)}
    >
      <RadioButton
        id={id}
        onChange={onChange}
        disabled={disabled}
        value={value}
        name={name}
      />
      <Stack>
        <Label cursor="pointer" htmlFor={id}>
          {label}
        </Label>
        {!!info && <Text variant={TextVariants.MUTED}>{info}</Text>}
      </Stack>
    </Inline>
  );
};

export { RadioButtonWithLabel };
