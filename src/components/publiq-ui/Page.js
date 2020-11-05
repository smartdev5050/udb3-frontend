import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme('page');

const StyledSection = styled.section`
  background-color: ${getValue('backgroundColor')};
  margin: 0 auto;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: flex-start;
  text-align: left;
`;

const Page = ({ children, className }) => {
  return <StyledSection className={className}>{children}</StyledSection>;
};

Page.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export { Page };
