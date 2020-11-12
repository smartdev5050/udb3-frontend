import PropTypes from 'prop-types';
import { Box, boxPropTypes, getBoxProps } from './Box';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme('listItem');

const ListItem = ({ children, className, onClick, ...props }) => (
  <Box
    forwardedAs="li"
    tabIndex={0}
    className={className}
    onClick={onClick}
    css={`
      position: relative;
      display: block;
      padding: 0.75rem 1.25rem;
      background-color: ${getValue('backgroundColor')};
      border: 1px solid rgba(0, 0, 0, 0.125);
    `}
    {...getBoxProps(props)}
  >
    {children}
  </Box>
);

ListItem.propTypes = {
  ...boxPropTypes,
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

ListItem.defaultTypes = {
  onClick: () => {},
};

export { ListItem };
