import { get } from 'lodash';
import { theme } from '../components/publiq-ui/theme';

const getValueFromTheme = (path) => {
  return get(theme, path);
};

export { getValueFromTheme };
