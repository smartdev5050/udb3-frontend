import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

import { Box, getBoxProps } from './Box';

const BaseInput = (props) => <Box as="textarea" {...props} />;

const TextArea = ({
  id,
  className,
  onInput,
  value,
  disabled,
  rows,
  ...props
}) => {
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

TextArea.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string,
  onInput: PropTypes.func,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
};

TextArea.defaultProps = {
  disabled: false,
  rows: 3,
};

export { TextArea };
