import { pickBy } from 'lodash';
import type { ChangeEvent, HTMLProps } from 'react';
import { forwardRef } from 'react';
import { Form } from 'react-bootstrap';

import { Box, BoxProps, getBoxProps } from './Box';
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

const getInputProps = (props) =>
  pickBy(props, (_value, key) =>
    [
      'accept',
      'className',
      'data-testid',
      'disabled',
      'id',
      'isInvalid',
      'maxLength',
      'name',
      'onBlur',
      'onFocus',
      'onKeyDown',
      'onPaste',
      'placeholder',
      'type',
      'value',
    ].includes(key),
  );

type InputProps = HTMLProps<HTMLInputElement> & {
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

type Props = Omit<BoxProps, 'onChange' | 'onBlur'> & InputProps;

const Input = forwardRef(({ onChange, className, ...props }: Props, ref) => (
  <Form.Control
    ref={ref}
    as={BaseInput}
    maxWidth="43rem"
    height={getGlobalFormInputHeight}
    borderRadius={getGlobalBorderRadius}
    onInput={onChange}
    {...getInputProps(props)}
    {...getBoxProps(props)}
  />
));

Input.displayName = 'Input';

Input.defaultProps = {
  type: 'text',
  isInvalid: false,
};

export { Input };
export type { InputProps, InputType };
