import { handleAuth, handleLogin, handleLogout } from '@auth0/nextjs-auth0';

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, {
        authorizationParams: {
          audience: 'https://api.publiq.be',
          scope: 'openid profile email',
        },
      });
    } catch (error) {
      res.status(error.status || 400).end(error.message);
    }
  },
  async logout(req, res) {
    try {
      await handleLogout(req, res, {
        returnTo: 'http://localhost:3000',
      });
    } catch (err) {
      res.status(err.status || 400).end();
    }
  },
});
