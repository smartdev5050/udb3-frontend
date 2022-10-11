import { Values } from './Values';

const Countries = {
  BE: 'BE',
  NL: 'NL',
  DE: 'DE',
} as const;

type Country = Values<typeof Countries>;

export { Countries };
export type { Country };
