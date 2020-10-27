const colors = {
  white: '#ffffff',
  lightgrey: '#efefef',
  udbPrimary: '#c0120c',
  udbBlue: '#004f94',
  udbGrey: '#ccc',
  success: '#5cb85c',
  danger: '#d9534f',
  selected: '#f3453f',
  textColor: '#222',
};

const theme = {
  colors,
  components: {
    button: {
      borderRadius: 0,
      paddingX: '0.8rem',
      paddingY: '0.267rem',
      primary: {
        backgroundColor: colors.udbBlue,
        borderColor: colors.udbBlue,
        activeBackgroundColor: '#003461',
        activeBorderColor: '#002d54',
      },
      secondary: {
        color: '#333',
        backgroundColor: colors.white,
        hoverBackgroundColor: '#e6e6e6',
        hoverBorderColor: '#adadad',
      },
    },
    pagination: {
      color: colors.textColor,
      activeBackgroundColor: colors.selected,
      activeBorderColor: colors.udbGrey,
      activeColor: colors.white,
      hoverBackgroundColor: colors.selected,
      hoverColor: colors.white,
      borderColor: colors.udbGrey,
      focusBoxShadow: 'none',
      paddingX: '0.84rem',
      paddingY: '0.44rem',
    },
  },
};

export { theme };
