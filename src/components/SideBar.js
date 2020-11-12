import { Stack } from './publiq-ui/Stack';
import { Link } from './publiq-ui/Link';
import styled from 'styled-components';

const StyledStack = styled(Stack)`
  position: relative;
  width: 200px;
  background-color: #c0120c;
  height: 100vh;
  color: #fff;
  text-align: left;
  z-index: 2000;
  padding: 5px;
`;

const SideBar = () => {
  return (
    <StyledStack>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/productions">Productions</Link>
    </StyledStack>
  );
};

export { SideBar };
