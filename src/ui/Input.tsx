import type { ChangeEvent } from 'react';
import { forwardRef } from 'react';
import { Form } from 'react-bootstrap';

import type { BoxProps } from './Box';
import { Box, getBoxProps } from './Box';

const BaseInput = forwardRef<HTMLInputElement, any>((props, ref) => (
  <Box as="input" {...props} ref={ref} />
));

BaseInput.displayName = 'BaseInput';

type InputType =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';

type InputProps = {
  type?: InputType;
  id: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  name: string;
};

type Props = Omit<BoxProps, 'onChange'> & InputProps;

const Input = forwardRef(
  (
    {
      type,
      id,
      placeholder,
      onChange,
      onBlur,
      onPaste,
      className,
      value,
      name,
      ...props
    }: Props,
    ref,
  ) => (
    <Form.Control
      ref={ref}
      forwardedAs={BaseInput}
      id={id}
      type={type}
      placeholder={placeholder}
      className={className}
      maxWidth="43rem"
      css="border-radius: 0;"
      onInput={onChange}
      onBlur={onBlur}
      onPaste={onPaste}
      value={value}
      name={name}
      {...getBoxProps(props)}
    />
  ),
);

Input.displayName = 'Input';

Input.defaultProps = {
  type: 'text',
};

export { Input };
export type { InputProps };
