import PropTypes from 'prop-types';
import { Box, boxPropTypes, getBoxProps } from './Box';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme('textArea');

const TextArea = ({
  id,
  className,
  onInput,
  value,
  disabled,
  paddingX,
  paddingY,
  ...props
}) => {
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
      paddingX={paddingX}
      paddingY={paddingY}
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
  disabled: PropTypes.bool,
  paddingX: PropTypes.number,
  paddingY: PropTypes.number,
};

TextArea.defaultProps = {
  disabled: false,
  paddingX: 3,
  paddingY: 1,
};

export { TextArea };
