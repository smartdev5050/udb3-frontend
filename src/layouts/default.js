import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Inline } from '../components/publiq-ui/Inline';
import { SideBar } from '../components/SideBar';

const StyledDiv = styled.div`
  flex: 1;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
`;

const Default = ({ children }) => {
  return (
    <Inline>
      <SideBar />
      <StyledDiv>{children}</StyledDiv>
    </Inline>
  );
};

Default.propTypes = {
  children: PropTypes.node,
};

export default Default;
