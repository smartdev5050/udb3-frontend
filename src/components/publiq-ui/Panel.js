import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getValueFromTheme } from './theme';
import { boxProps, boxPropTypes, getBoxProps } from './Box';

const getValue = getValueFromTheme('panel');

const StyledSection = styled.section`
  border: 1px solid ${getValue('borderColor')};
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);

  ${boxProps}
`;

const Panel = ({ children, className, ...props }) => (
  <StyledSection className={className} {...getBoxProps(props)} marginBottom={4}>
    {children}
  </StyledSection>
);

Panel.propTypes = {
  ...boxPropTypes,
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Panel };
