import PropTypes from 'prop-types';
import { Box, boxPropTypes, getBoxProps } from './Box';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme('textArea');

const TextArea = ({ id, children, className, onInput, ...props }) => {
  return (
    <Box
      forwardedAs="textarea"
      id={id}
      className={className}
      width="100%"
      minHeight="4rem"
      onInput={onInput}
      css={`
        border: 1px solid ${getValue('borderColor')};
      `}
      {...getBoxProps(props)}
    >
      {children}
    </Box>
  );
};

TextArea.propTypes = {
  ...boxPropTypes,
  id: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  onInput: PropTypes.func,
};

export { TextArea };
