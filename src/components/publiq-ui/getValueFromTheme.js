import { get } from 'lodash';
import { theme } from './theme';

const getValueFromTheme = (path) => {
  return get(theme, path);
};

export { getValueFromTheme };
