import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { publicRuntimeConfig } from '../../next.config';

const initializeSentry = () => {
  Sentry.init({
    environment: publicRuntimeConfig.environment,
    dsn: publicRuntimeConfig.sentryDsn,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
};

const setSentryUser = ({ id, email, username }) => {
  Sentry.setUser({ id, email, username });
};

export { initializeSentry, setSentryUser };
