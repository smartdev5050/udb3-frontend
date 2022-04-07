import type { ChangeEvent } from 'react';
import { forwardRef } from 'react';
import { Form } from 'react-bootstrap';

import type { BoxProps } from './Box';
import { Box, getBoxProps } from './Box';

const BaseRadioButton = forwardRef<HTMLInputElement, any>((props, ref) => (
  <Box as="input" {...props} ref={ref} />
));

BaseRadioButton.displayName = 'RadioButton';

type InputType = 'radio' | 'checkbox' | 'switch';

type RadioButtonProps = {
  type?: InputType;
  id?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  disabled?: boolean;
  isInvalid?: boolean;
  isValid?: boolean;
};

type Props = Omit<BoxProps, 'onChange'> & RadioButtonProps;

const RadioButton = forwardRef(
  (
    {
      type,
      id,
      onChange,
      className,
      value,
      name,
      disabled,
      isInvalid,
      isValid,
      ...props
    }: Props,
    ref,
  ) => (
    <Form.Check
      ref={ref}
      forwardedAs={BaseRadioButton}
      id={id}
      type={type}
      className={className}
      onChange={onChange}
      value={value}
      name={name}
      isInvalid={isInvalid}
      isValid={isValid}
      disabled={disabled}
      {...getBoxProps(props)}
    />
  ),
);

RadioButton.displayName = 'RadioButton';

RadioButton.defaultProps = {
  type: 'radio',
  isInvalid: false,
  disabled: false,
};

export { RadioButton };
export type { RadioButtonProps };
