import jwtDecode from 'jwt-decode';
import { logout } from '../services/auth';
import * as user from './user';
import * as events from './events';
import * as productions from './productions';

export const Environments = {
  DEVELOPMENT: 'development',
  ACCEPTANCE: 'acceptance',
  TEST: 'test',
  PRODUCTION: 'production',
};

export const debugLogger = (environment) => (...args) => {
  if (environment === Environments.DEVELOPMENT) {
    /* eslint-disable no-console */
    console.log(...args);
    /* eslint-enable no-console */
  }
};

export const getHeaders = (token, apiKey) => ({
  Authorization: `Bearer ${token}`,
  'X-Api-Key': apiKey,
});

const isTokenValid = (token) => {
  let decodedToken;
  try {
    decodedToken = jwtDecode(token);
  } catch {
    return false;
  }

  const now = Math.round(Date.now() / 1000);
  return decodedToken.exp - now > 0;
};

export const fetchWithLogoutWhenFailed = (authUrl) => async (...args) => {
  const response = await fetch(...args);
  if (response.status === 401 || response.status === 403) {
    logout(authUrl);
  }
  return response;
};

export default (authUrl, apiUrl, apiKey, environment, tokenCallback) => {
  const fetch = fetchWithLogoutWhenFailed(authUrl);

  const headersCallback = () => {
    const token = tokenCallback();
    if (!isTokenValid(token)) {
      logout(authUrl);
      return;
    }
    return getHeaders(token, apiKey);
  };

  const debug = debugLogger(environment);

  const args = [apiUrl, headersCallback, fetch, environment, debug];

  return {
    events: {
      findToModerate: events.findToModerate(...args),
      findById: events.findById(...args),
      findByIds: events.findByIds(...args),
      getCalendarSummary: events.getCalendarSummary(...args),
    },
    productions: {
      find: productions.find(...args),
      addEventById: productions.addEventById(...args),
      addEventsByIds: productions.addEventsByIds(...args),
      deleteEventById: productions.deleteEventById(...args),
      getSuggestedEvents: productions.getSuggestedEvents(...args),
      skipSuggestedEvents: productions.skipSuggestedEvents(...args),
      createWithEvents: productions.createWithEvents(...args),
      mergeProductions: productions.mergeProductions(...args),
    },
    user: {
      getMe: user.getMe(...args),
      getPermissions: user.getPermissions(...args),
      getRoles: user.getRoles(...args),
    },
  };
};
