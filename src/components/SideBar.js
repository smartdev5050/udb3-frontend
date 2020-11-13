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
      <Stack as="ul">
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/event">Invoeren</Link>
        </li>
        <li>
          <Link href="/search">Zoeken</Link>
        </li>
      </Stack>
      <Stack as="ul">
        <li>
          <Link href="/dashboard">Gebruikers</Link>
        </li>
        <li>
          <Link href="/event">Rollen</Link>
        </li>
        <li>
          <Link href="/search">Labels</Link>
        </li>
        <li>
          <Link href="/search">Organisaties</Link>
        </li>
        <li>
          <Link href="/search">Producties</Link>
        </li>
      </Stack>
    </StyledStack>
  );
};

export { SideBar };
