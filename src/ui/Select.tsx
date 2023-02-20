import type { ChangeEvent } from 'react';
import { forwardRef } from 'react';
import { Form } from 'react-bootstrap';

import type { BoxProps } from './Box';
import { Box, getBoxProps } from './Box';
import { getGlobalBorderRadius } from './theme';

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

const Select = forwardRef<HTMLInputElement, Props>(
  (
    { id, onChange, className, value, size, children, ariaLabel, ...props },
    ref,
  ) => (
    <Form.Control
      forwardedAs={BaseSelect}
      size={size}
      ref={ref}
      id={id}
      className={className}
      onChange={onChange}
      value={value}
      aria-label={ariaLabel}
      css={`
        padding: 0.275rem 0.65rem;
        border-radius: ${getGlobalBorderRadius};
        max-width="43rem"
      `}
      {...getBoxProps(props)}
    >
      {children}
    </Form.Control>
  ),
);

Select.displayName = 'Select';

export { Select };
export type { Props as SelectProps };
