import { Values } from './Values';

const Countries = {
  BE: 'BE',
  NL: 'NL',
} as const;

type Country = Values<typeof Countries>;

export { Countries };
export type { Country };
