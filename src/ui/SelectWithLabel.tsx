import type { LabelPositions } from 'Label';

import type { Values } from '@/types/Values';

import { FormElement } from './FormElement';
import type { SelectProps } from './Select';
import { Select } from './Select';

type Props = SelectProps & {
  label: string;
  labelPosition: Values<typeof LabelPositions>;
};

const SelectWithLabel = ({
  id,
  label,
  onChange,
  className,
  value,
  size,
  children,
  ariaLabel,
  labelPosition,
}: Props) => {
  return (
    <FormElement
      className={className}
      Component={
        <Select
          onChange={onChange}
          value={value}
          ariaLabel={ariaLabel}
          size={size}
        >
          {children}
        </Select>
      }
      id={id}
      label={label}
      labelPosition={labelPosition}
    />
  );
};

export { SelectWithLabel };
