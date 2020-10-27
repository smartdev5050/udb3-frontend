import get from 'lodash/get';
import { theme } from './theme';

const getValueFromTheme = (path) => {
  return get(theme, path);
};

export { getValueFromTheme };
