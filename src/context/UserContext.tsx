import { UserProvider } from '@auth0/nextjs-auth0/client';

const UserContext = ({ children }) => {
  return <UserProvider>{children}</UserProvider>;
};

export { UserContext };
