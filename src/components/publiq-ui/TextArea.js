import PropTypes from 'prop-types';
import { Box, boxPropTypes, getBoxProps } from './Box';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme('textArea');

const TextArea = ({ id, className, onInput, value, ...props }) => {
  return (
    <Box
      forwardedAs="textarea"
      id={id}
      className={className}
      width="100%"
      minHeight="4rem"
      onInput={onInput}
      value={value}
      css={`
        border: 1px solid ${getValue('borderColor')};
      `}
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
};

export { TextArea };
