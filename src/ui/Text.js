import PropTypes from 'prop-types';
import { css } from 'styled-components';
import { Box, boxPropTypes, getBoxProps } from './Box';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme('text');

const TextVariants = {
  REGULAR: 'regular',
  MUTED: 'muted',
};

const mutedCSS = css`
  color: ${getValue('muted.color')};
`;

const Text = ({ as, children, className, variant, ...props }) => {
  const css = variant === TextVariants.MUTED ? mutedCSS : ``;
  return (
    <Box as={as} className={className} css={css} {...getBoxProps(props)}>
      {children}
    </Box>
  );
};

Text.propTypes = {
  ...boxPropTypes,
  as: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.string,
};

Text.defaultProps = {
  as: 'span',
  variant: TextVariants.REGULAR,
};

export { Text, TextVariants };
