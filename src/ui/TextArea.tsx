import { Form } from 'react-bootstrap';

import type { BoxProps } from './Box';
import { Box, getBoxProps } from './Box';

type TextAreaProps = { value: string; rows?: number };

type Props = BoxProps & TextAreaProps;

const BaseInput = (props: Props) => <Box as="textarea" {...props} />;

const TextArea = ({
  id,
  className,
  onInput,
  value,
  disabled,
  rows,
  ...props
}: Props) => {
  return (
    <Form.Control
      forwardedAs={BaseInput}
      id={id}
      className={className}
      width="100%"
      minHeight="4rem"
      onInput={onInput}
      value={value}
      disabled={disabled}
      css="border-radius: 0;"
      rows={rows}
      {...getBoxProps(props)}
    />
  );
};

TextArea.defaultProps = {
  disabled: false,
  rows: 3,
};

export { TextArea };
export type { TextAreaProps };
