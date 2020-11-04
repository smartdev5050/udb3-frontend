import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Title } from './Title';

const StyledTitle = styled(Title)`
  &.h1 {
    line-height: 3.74rem;
    color: #222;
    border-bottom: 1px solid #ccc;
    margin-bottom: 2rem;
  }
`;

const PageTitle = ({ children, className }) => (
  <StyledTitle size={1} className={className}>
    {children}
  </StyledTitle>
);

PageTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export { PageTitle };
