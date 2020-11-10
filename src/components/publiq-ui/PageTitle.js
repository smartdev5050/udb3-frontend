import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getValueFromTheme } from './theme';
import { Title } from './Title';

const getValue = getValueFromTheme('pageTitle');

const StyledTitle = styled(Title)`
  &.h1 {
    width: 100%;
    line-height: 3.74rem;
    color: ${getValue('color')};
    border-bottom: 1px solid ${getValue('borderColor')};
  }
`;

const PageTitle = ({ children, className }) => (
  <StyledTitle size={1} className={className} marginBottom={5}>
    {children}
  </StyledTitle>
);

PageTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export { PageTitle };
