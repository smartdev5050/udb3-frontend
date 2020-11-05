import get from 'lodash/get';

const colors = {
  udbRed: '#c0120c',
  udbBlue: '#004f94',
  white: '#ffffff',
  grey1: '#f0f0f0',
  grey2: '#ccc',
  success: '#5cb85c',
  danger: '#d9534f',
  selected: '#f3453f',
  textColor: '#222',
};

const theme = {
  colors,
  components: {
    alert: {
      borderRadius: 0,
    },
    badge: {
      color: colors.white,
      backgroundColor: colors.danger,
    },
    button: {
      borderRadius: 0,
      paddingX: '0.8rem',
      paddingY: '0.267rem',
      primary: {
        backgroundColor: colors.udbBlue,
        borderColor: colors.udbBlue,
        hoverBackgroundColor: '#003461',
        hoverBorderColor: '#002d54',
        activeBackgroundColor: '#003461',
        activeBorderColor: '#002d54',
        activeBoxShadow: 'none',
        focusBoxShadow: 'none',
      },
      secondary: {
        color: '#333',
        backgroundColor: colors.white,
        hoverBackgroundColor: '#e6e6e6',
        hoverBorderColor: '#adadad',
        activeColor: '#333',
        activeBackgroundColor: '#ccc',
        activeBorderColor: '#ccc',
        activeBoxShadow: 'none',
        focusBoxShadow: 'none',
      },
      success: {
        color: colors.white,
        borderColor: colors.success,
        backgroundColor: colors.success,
        activeBoxShadow: 'none',
        focusBoxShadow: 'none',
      },
      danger: {
        color: colors.white,
        borderColor: colors.danger,
        backgroundColor: colors.danger,
        activeBoxShadow: 'none',
        focusBoxShadow: 'none',
      },
    },
    pagination: {
      color: colors.textColor,
      activeBackgroundColor: colors.selected,
      activeBorderColor: colors.grey2,
      activeColor: colors.white,
      hoverBackgroundColor: colors.selected,
      hoverColor: colors.white,
      borderColor: colors.grey2,
      focusBoxShadow: 'none',
      paddingX: '0.84rem',
      paddingY: '0.44rem',
    },
    page: {
      backgroundColor: colors.grey1,
    },
  },
};

const getValueFromTheme = (component) => (path) => (props) =>
  get(props.theme, `components.${component}.${path}`);

export { theme, getValueFromTheme };
