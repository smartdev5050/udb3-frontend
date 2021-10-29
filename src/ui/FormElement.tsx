import type { ReactNode } from 'react';
import { cloneElement } from 'react';

import { Label, LabelVariants } from './Label';
import type { StackProps } from './Stack';
import { getStackProps, Stack } from './Stack';
import { Text } from './Text';

type Props = {
  id: string;
  ref: any;
  label?: string;
  error?: string;
  Component: ReactNode;
} & StackProps;

const FormElement = ({ id, ref, label, error, Component, ...props }: Props) => {
  // @ts-expect-error
  const component = cloneElement(Component, { ...Component.props, id, ref });
  return (
    <Stack spacing={2} {...getStackProps(props)}>
      {label && (
        <Label variant={LabelVariants.BOLD} htmlFor={id}>
          {label}
        </Label>
      )}
      {component}
      {error && <Text color="red">{error}</Text>}
    </Stack>
  );
};

export { FormElement };
