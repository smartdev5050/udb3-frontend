import PropTypes from 'prop-types';
import { Box, boxPropTypes, getBoxProps } from './Box';


const TextArea = ({ id, className, onInput, value, disabled, ...props }) => {
  return (
    <Box
      forwardedAs="textarea"
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
  ...boxPropTypes,
  id: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string,
  onInput: PropTypes.func,
  disabled: PropTypes.bool,
};

TextArea.defaultProps = {
  disabled: false,
  paddingX: 3,
  paddingY: 1,
};

export { TextArea };
