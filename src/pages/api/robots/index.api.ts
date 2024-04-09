import { NextApiHandler } from 'next';

const productionSitemap = `
User-agent: *
Disallow: /dashboard
Disallow: /create
Disallow: /event
Disallow: /place
Disallow: /organizer
Disallow: /manage
Allow: /login

User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /
`;

const developmentSitemap = `
User-agent: *
Disallow: /
`;

const robots: NextApiHandler = async (req, res) => {
  const env = process.env.NEXT_PUBLIC_ENVIRONMENT;

  res.setHeader('Content-Type', 'text/plain');

  res.send(env === 'production' ? productionSitemap : developmentSitemap);
};

export default robots;
