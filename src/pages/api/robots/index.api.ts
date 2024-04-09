import { NextApiHandler } from 'next';

const removeExtraWhitespace = (str: string) => {
    return str
        .split('\n')
        .map((line) => line.trim())
        .join('\n');
};

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

    if (env === 'production') {
        res.write(removeExtraWhitespace(productionSitemap));
    } else {
        res.write(removeExtraWhitespace(developmentSitemap));
    }

    res.end();
};

export default robots;
