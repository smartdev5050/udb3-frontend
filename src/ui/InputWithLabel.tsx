import type { Values } from '@/types/Values';

import type { BoxProps } from './Box';
import { FormElement } from './FormElement';
import type { InputProps } from './Input';
import { Input } from './Input';
import type { LabelPositions } from './Label';

type Props = Omit<BoxProps, 'onChange'> &
  InputProps & {
    label: string;
    labelPosition: Values<typeof LabelPositions>;
  };

const InputWithLabel = ({
  className,
  value,
  onChange,
  id,
  label,
  labelPosition,
}: Props) => {
  return (
    <FormElement
      className={className}
      Component={<Input onChange={onChange} value={value} />}
      id={id}
      label={label}
      labelPosition={labelPosition}
    />
  );
};

export { InputWithLabel };
