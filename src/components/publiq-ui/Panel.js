import PropTypes from 'prop-types';
import { getValueFromTheme } from './theme';
import { Box, boxPropTypes, getBoxProps } from './Box';

const getValue = getValueFromTheme('panel');

const Panel = ({ children, className, ...props }) => (
  <Box
    css={`
      border: 1px solid ${getValue('borderColor')};
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    `}
    className={className}
    {...getBoxProps(props)}
    marginBottom={4}
  >
    {children}
  </Box>
);

Panel.propTypes = {
  ...boxPropTypes,
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Panel };
