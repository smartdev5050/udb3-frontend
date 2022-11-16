import get from 'lodash/get';
import { borderRadius, lighten } from 'polished';

import type { Values } from '@/types/Values';

const colors = {
  udbRed: '#c0120c',
  udbBlue: '#004f94',
  white: '#ffffff',
  grey1: '#f0f0f0',
  grey2: '#ccc',
  grey3: '#ddd',
  grey4: '#f5f5f5',
  grey5: '#777777',
  grey6: '#999999',
  green1: '#5cb85c',
  green2: '#449d44',
  green3: '#28a745',
  green4: '#dcf2d7',
  green5: '#c7e6c7',
  pink1: '#fcd1cf',
  pink2: '#f9a29f',
  red1: '#d9534f',
  red2: '#f3453f',
  red3: '#d23430',
  red4: '#900d09',
  red5: '#ef1810',
  red: 'red',
  blue1: '#f0f8ff',
  blue2: '#a3d4ff',
  blue3: '#3e88ab',
  textColor: '#222',
} as const;

const Breakpoints = {
  XS: 'xs',
  S: 's',
  M: 'm',
  L: 'l',
} as const;

// z-index utils
const base = 0;
const above = 1;

const zIndexPaginationPageLink = above + base;

const zIndexDatePickerInput = above + zIndexPaginationPageLink;
const zIndexDatePickerButton = above + zIndexDatePickerInput;

const zIndexSidebar = above + zIndexDatePickerButton;
const zIndexPageFooter = zIndexSidebar;

const zIndexJobLogger = above + zIndexSidebar;
const zIndexToast = zIndexJobLogger;

const zIndexModalBackdrop = above + zIndexToast;

const zIndexModal = above + zIndexModalBackdrop;
//

type BreakpointValues = Values<typeof Breakpoints>;

const getGlobalBorderRadius = (props: { theme: Theme }) =>
  props.theme.borderRadius;

const theme = {
  colors,
  breakpoints: {
    [Breakpoints.XS]: 575,
    [Breakpoints.S]: 768,
    [Breakpoints.M]: 992,
    [Breakpoints.L]: 1200,
  },
  borderRadius: '8px',
  components: {
    alert: {
      borderRadius: '8px',
    },
    toast: {
      zIndex: zIndexToast,
      textColor: {
        dark: colors.textColor,
        light: colors.white,
      },
      primary: {
        backgroundColor: colors.udbBlue,
        borderColor: '#00417b',
      },
      secondary: {
        color: '#333',
        backgroundColor: colors.white,
      },
      success: {
        borderColor: colors.green2,
      },
      danger: {
        borderColor: colors.red3,
      },
    },
    modal: {
      zIndex: zIndexModal,
      zIndexBackdrop: zIndexModalBackdrop,
    },
    datePicker: {
      zIndexInput: zIndexDatePickerInput,
      zIndexButton: zIndexDatePickerButton,
    },
    link: {
      color: colors.udbBlue,
    },
    badge: {
      color: colors.white,
      backgroundColor: colors.red1,
    },
    button: {
      borderRadius: '8px',
      paddingX: '0.9rem',
      paddingY: '0.5rem',
      boxShadow: {
        small: '0px 2px 3px 0px rgba(210, 210, 210, 0.5)',
        large: '0px 4px 6px 0px rgba(210, 210, 210, 0.7)',
      },
      primary: {
        backgroundColor: colors.udbBlue,
        borderColor: '#00417b',
        hoverBackgroundColor: '#003461',
        hoverBorderColor: '#00213d',
        activeBackgroundColor: '#003461',
        activeBorderColor: '#00213d',
      },
      secondary: {
        color: '#333',
        backgroundColor: colors.white,
        hoverBackgroundColor: '#e6e6e6',
        hoverBorderColor: '#adadad',
        activeColor: '#333',
        activeBackgroundColor: '#e6e6e6',
        activeBorderColor: '#adadad',
      },
      success: {
        color: colors.white,
        borderColor: colors.green2,
        hoverBackgroundColor: colors.green2,
        hoverBorderColor: colors.green3,
        backgroundColor: colors.green1,
      },
      danger: {
        color: colors.white,
        borderColor: colors.red3,
        hoverBackgroundColor: colors.red3,
        hoverBorderColor: colors.red4,
        backgroundColor: colors.red1,
      },
    },
    global: {
      successIcon: colors.green3,
    },
    pagination: {
      color: colors.textColor,
      activeBackgroundColor: colors.red2,
      activeBorderColor: colors.grey2,
      activeColor: colors.white,
      hoverBackgroundColor: colors.red2,
      hoverColor: colors.white,
      borderColor: colors.grey2,
      focusBoxShadow: 'none',
      paddingX: '0.84rem',
      paddingY: '0.44rem',
      pageLink: {
        zIndex: zIndexPaginationPageLink,
      },
    },
    typeahead: {
      active: {
        color: colors.white,
        backgroundColor: colors.red2,
      },
      hover: {
        color: colors.white,
        backgroundColor: colors.red2,
      },
      highlight: {
        fontWeight: 'bold',
        backgroundColor: 'transparent',
      },
    },
    page: {
      backgroundColor: colors.grey1,
      borderColor: colors.grey3,
    },
    pageTitle: {
      color: colors.textColor,
      borderColor: colors.grey2,
    },
    pageFooter: {
      zIndex: zIndexPageFooter,
    },
    title: {
      color: colors.textColor,
      borderColor: colors.grey2,
    },
    panel: {
      borderColor: colors.grey3,
    },
    panelFooter: {
      borderColor: colors.grey3,
      backgroundColor: colors.grey4,
    },
    listItem: {
      backgroundColor: colors.white,
    },
    spinner: {
      primary: {
        color: colors.udbBlue,
      },
      light: {
        color: colors.white,
      },
    },
    sidebar: {
      zIndex: zIndexSidebar,
      color: colors.white,
      backgroundColor: colors.udbRed,
    },
    jobLogger: {
      zIndex: zIndexJobLogger,
    },
    menu: {
      borderColor: colors.red4,
    },
    menuItem: {
      hover: {
        backgroundColor: colors.red4,
      },
    },
    announcement: {
      borderColor: colors.grey2,
      hoverBackgroundColor: colors.grey1,
      selected: {
        backgroundColor: colors.pink1,
        hoverBackgroundColor: colors.pink2,
      },
    },
    announcementList: {
      borderColor: colors.grey2,
    },
    announcementContent: {
      linkColor: colors.udbBlue,
    },
    jobStatusIcon: {
      backgroundColor: colors.white,
      warning: {
        circleFillColor: colors.udbRed,
        remarkFillColor: colors.white,
      },
      busy: {
        spinnerStrokeColor: colors.blue3,
        backgroundColor: colors.white,
      },
      complete: {
        checkFillColor: colors.green4,
      },
    },
    productionItem: {
      borderColor: colors.grey3,
      activeColor: colors.white,
      backgroundColor: colors.white,
      activeBackgroundColor: colors.red2,
    },
    eventItem: {
      borderColor: colors.grey3,
    },
    detailTable: {
      backgroundColor: colors.grey1,
      borderColor: colors.grey3,
    },
    loginPage: {
      backgroundColor: colors.grey1,
    },
    loginLogo: {
      backgroundColor: colors.red5,
      colorSoft: lighten('0.23', colors.udbRed),
      colorMedium: lighten('0.31', colors.udbRed),
      colorHard: lighten('0.40', colors.udbRed),
    },
    pageNotFound: {
      iconColor: colors.grey2,
    },
    pageError: {
      iconColor: colors.red5,
    },
    selectionTable: {
      color: colors.grey5,
      borderColor: colors.grey3,
    },
    dashboardPage: {
      listItem: {
        backgroundColor: colors.white,
        borderColor: colors.grey3,
        color: colors.udbBlue,
        passedEvent: {
          color: colors.grey5,
        },
      },
    },
    createPage: {
      title: {
        color: colors.textColor,
        borderColor: colors.grey2,
      },
      stepNumber: {
        backgroundColor: colors.grey5,
      },
      footer: {
        color: colors.textColor,
      },
    },
    tabs: {
      color: colors.udbBlue,
      hoverColor: colors.textColor,
      borderColor: colors.grey3,
      activeTabColor: colors.grey5,
      activeTabBackgroundColor: colors.grey1,
      hoverTabBackgroundColor: colors.grey3,
      borderRadius: '8px',
    },
    pictureUploadBox: {
      backgroundColor: colors.white,
      borderColor: colors.grey2,
      errorBorderColor: colors.red1,
      imageIconColor: colors.grey5,
      imageBorderColor: colors.grey2,
      mainImageBackgroundColor: colors.blue1,
      mainImageBorderColor: colors.blue2,
      thumbnailBorderColor: colors.grey6,
    },
    ageRange: {
      rangeTextColor: colors.grey5,
    },
    priceInformation: {
      borderColor: colors.grey3,
      iconColor: colors.grey5,
    },
    contactInformation: {
      borderColor: colors.grey3,
      iconColor: colors.grey2,
      iconColorHover: colors.grey6,
      errorText: colors.red,
    },
    videoUploadBox: {
      backgroundColor: colors.white,
      borderColor: colors.grey2,
      errorBorderColor: colors.red1,
      imageIconColor: colors.grey5,
      imageBorderColor: colors.grey2,
      mainImageBackgroundColor: colors.blue1,
      mainImageBorderColor: colors.blue2,
      thumbnailBorderColor: colors.grey6,
    },
    toggleBox: {
      backgroundColor: colors.white,
      activeBackgroundColor: colors.green5,
      borderColor: colors.grey2,
      textColor: colors.udbBlue,
      activeTextColor: colors.textColor,
      iconColor: colors.grey5,
      iconCheckColor: colors.green3,
      boxShadow: {
        small: '0px 2px 3px 0px rgba(210, 210, 210, 0.5)',
        large: '0px 4px 6px 0px rgba(210, 210, 210, 0.7)',
      },
    },
    dropdown: {
      activeToggleBoxShadow: 'inset 0 3px 5px rgba(0, 0, 0, 0.125)',
    },
    text: {
      muted: {
        color: colors.grey5,
      },
      error: {
        color: colors.red,
      },
    },
    organizerAddModal: {
      address: {
        borderColor: colors.grey3,
      },
    },
  },
} as const;

type Theme = typeof theme;

const getValueFromTheme = (component: string) => (path: string) => (props: {
  theme: Theme;
}) => get(props.theme, `components.${component}.${path}`);

export { Breakpoints, colors, getGlobalBorderRadius, getValueFromTheme, theme };
export type { BreakpointValues, Theme };
