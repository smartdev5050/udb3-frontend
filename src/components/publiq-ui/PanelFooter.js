import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme('panelFooter');

const StyledSection = styled.section`
  padding: 0.75rem 1rem;
  background-color: ${getValue('backgroundColor')};
  border-top: 1px solid ${getValue('borderColor')};
`;

const PanelFooter = ({ children, className }) => (
  <StyledSection className={className}>{children}</StyledSection>
);

PanelFooter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export { PanelFooter };
