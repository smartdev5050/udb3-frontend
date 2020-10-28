import get from 'lodash/get';

const getValueFromTheme = (props, path) => {
  return get(props.theme, path);
};

export { getValueFromTheme };
