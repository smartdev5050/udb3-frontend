import { Auth0Provider } from '@auth0/auth0-react';
import getConfig from 'next/config';

const Auth0Context = () => {
  const { publicRuntimeConfig } = getConfig();

  const clientId = publicRuntimeConfig.auth0ClientId;
  const domain = publicRuntimeConfig.auth0Domain;

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    />
  );
};

export { Auth0Context };
