import type { ChangeEvent } from 'react';
import { forwardRef } from 'react';
import { Form } from 'react-bootstrap';

import type { BoxProps } from './Box';
import { Box, getBoxProps } from './Box';

const BaseSelect = forwardRef<HTMLSelectElement, any>((props, ref) => (
  <Box as="select" {...props} ref={ref} />
));

BaseSelect.displayName = 'BaseSelect';

type SelectProps = {
  id?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  size?: string;
  ariaLabel?: string;
  value?: string;
};

type Props = Omit<BoxProps, 'onChange'> & SelectProps;

const Select = forwardRef(
  (
    {
      id,
      onChange,
      className,
      value,
      size,
      children,
      ariaLabel,
      ...props
    }: Props,
    ref,
  ) => (
    <Form.Control
      as={BaseSelect}
      size={size}
      ref={ref}
      id={id}
      className={className}
      maxWidth="43rem"
      onChange={onChange}
      value={value}
      aria-label={ariaLabel}
      {...getBoxProps(props)}
    >
      {children}
    </Form.Control>
  ),
);

Select.displayName = 'Select';

export { Select };
export type { Props as SelectProps };
