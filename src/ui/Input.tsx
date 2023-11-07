import type { ChangeEvent, HTMLProps } from 'react';
import { forwardRef } from 'react';
import { Form } from 'react-bootstrap';

import type { BoxProps } from './Box';
import { Box, getBoxProps } from './Box';
import { getGlobalBorderRadius, getGlobalFormInputHeight } from './theme';

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
  | 'numeric'
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

type InputProps = HTMLProps<HTMLInputElement> & {
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

type Props = Omit<BoxProps, 'onChange' | 'onBlur'> & InputProps;

const Input = forwardRef(
  (
    {
      type,
      id,
      placeholder,
      onChange,
      onBlur,
      onPaste,
      onFocus,
      onKeyDown,
      className,
      value,
      name,
      isInvalid,
      disabled,
      accept,
      ...props
    }: Props,
    ref,
  ) => (
    <Form.Control
      ref={ref}
      as={BaseInput}
      id={id}
      type={type}
      placeholder={placeholder}
      className={className}
      maxWidth="43rem"
      height={getGlobalFormInputHeight}
      borderRadius={getGlobalBorderRadius}
      onInput={onChange}
      onBlur={onBlur}
      onPaste={onPaste}
      value={value}
      name={name}
      isInvalid={isInvalid}
      accept={accept}
      disabled={disabled}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      data-testid={props['data-testid']}
      {...getBoxProps(props)}
    />
  ),
);

Input.displayName = 'Input';

Input.defaultProps = {
  type: 'text',
  isInvalid: false,
};

export { Input };
export type { InputProps, InputType };
