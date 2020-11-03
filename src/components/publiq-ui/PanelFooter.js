import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledSection = styled.section`
  padding: 0.75rem 1rem;
  background-color: #f5f5f5;
  border-top: 1px solid #ddd;
`;

const PanelFooter = ({ children, className }) => (
  <StyledSection className={className}>{children}</StyledSection>
);

PanelFooter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export { PanelFooter };
