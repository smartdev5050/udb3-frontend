import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { publicRuntimeConfig } from '../../next.config';

const initializeSentry = () => {
  Sentry.init({
    environment: publicRuntimeConfig.environment,
    dsn:
      'https://0aa9d6e3306c46fc90eade0e05b955f8@o424400.ingest.sentry.io/5692505',
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
};

const setSentryUser = ({ id, email, username }) => {
  Sentry.setUser({ id, email, username });
};

export { initializeSentry, setSentryUser };
