import PropTypes from 'prop-types';
import { Box } from '../components/publiq-ui/Box';
import { Inline } from '../components/publiq-ui/Inline';
import { SideBar } from '../components/SideBar';

const Frame = ({ children }) => {
  return (
    <Inline>
      <SideBar />
      <Box
        css={`
          flex: 1;
          height: 100vh;
          overflow-x: hidden;
          overflow-y: auto;
        `}
      >
        {children}
      </Box>
    </Inline>
  );
};

Frame.propTypes = {
  children: PropTypes.node,
};

export default Frame;
