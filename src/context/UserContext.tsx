import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Children } from 'react';

const UserContext = ({ children }) => {
  return <UserProvider>{children}</UserProvider>;
};

export { UserContext };
