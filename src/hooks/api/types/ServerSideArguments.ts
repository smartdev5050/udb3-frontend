import type { NextApiRequest } from 'next';
import type { QueryClient } from 'react-query';

type ServerSideArguments = {
  req?: NextApiRequest;
  queryClient?: QueryClient;
};

export type { ServerSideArguments };
