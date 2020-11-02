import get from 'lodash/get';

const getValueFromTheme = (component) => (path) => (props) =>
  get(props.theme, `components.${component}.${path}`);

export { getValueFromTheme };
