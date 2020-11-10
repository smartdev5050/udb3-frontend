import PropTypes from 'prop-types';
import styled from 'styled-components';
import { boxProps, boxPropTypes, getBoxProps } from './Box';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme('listItem');

const StyledListItem = styled.li`
  position: relative;
  display: block;
  padding: 0.75rem 1.25rem;
  background-color: ${getValue('backgroundColor')};
  border: 1px solid rgba(0, 0, 0, 0.125);

  ${boxProps}
`;

const ListItem = ({ children, className, onClick, ...props }) => {
  return (
    <StyledListItem
      tabIndex={0}
      className={className}
      onClick={onClick}
      {...getBoxProps(props)}
    >
      {children}
    </StyledListItem>
  );
};

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
