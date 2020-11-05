import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme('panel');

const StyledSection = styled.section`
  border: 1px solid ${getValue('borderColor')};
  margin-bottom: 1rem;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
`;

const Panel = ({ children, className }) => (
  <StyledSection className={className}>{children}</StyledSection>
);

Panel.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Panel };
