import get from 'lodash/get';
import { lighten } from 'polished';

import type { Values } from '@/types/Values';

const colors = {
  udbRed: '#c0120c',
  udbMainBlue: '#009FDF',
  udbMainDarkBlue: '#0083B8',
  udbMainDarkestBlue: '#005C7C',
  udbMainMediumBlue: '#DFF8FF',
  udbMainLightBlue: '#F8FDFF',
  udbMainGrey: '#6A777B',
  udbMainDarkestGrey: '#141515',
  udbMainDarkGrey: '#6A6E70',
  udbMainLightGrey: '#BCC3C6',
  udbMainPositiveGreen: '#6BCD69',
  udbMainLightGreen: '#F3FCF7',
  udbBlue: '#004f94',
  white: '#ffffff',
  greylight: '#FCFCFC',
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
  orange1: '#F19E49',
  textColor: '#222',
  warning: '#E69336',
  danger: '#DD5242',
} as const;

const Breakpoints = {
  XS: 'xs',
  S: 's',
  M: 'm',
  L: 'l',
  XL: 'xl',
} as const;

// z-index utils
const base = 0;
const above = 1;

const zIndexPaginationPageLink = above + base;

const zIndexDatePickerInput = above + zIndexPaginationPageLink;
const zIndexDatePickerButton = above + zIndexDatePickerInput;
const zIndexDatePickerPopup = above + zIndexDatePickerButton;

const zIndexSidebar = above + zIndexDatePickerPopup;
const zIndexPageFooter = zIndexSidebar;

const zIndexJobLogger = above + zIndexSidebar;
const zIndexToast = zIndexJobLogger;

const zIndexModalBackdrop = above + zIndexToast;

const zIndexModal = above + zIndexModalBackdrop;

const zIndexTimePickerPopup = above + zIndexModal;
//

type BreakpointValues = Values<typeof Breakpoints>;

const getGlobalBorderRadius = (props: { theme: Theme }) =>
  props.theme.borderRadius;

const getGlobalFormInputHeight = (props: { theme: Theme }) =>
  props.theme.formInputHeight;

const theme = {
  colors,
  breakpoints: {
    [Breakpoints.XS]: 575,
    [Breakpoints.S]: 768,
    [Breakpoints.M]: 992,
    [Breakpoints.L]: 1200,
  },
  borderRadius: '8px',
  formInputHeight: 'calc(1.5rem + 0.9rem + 2px)',
  components: {
    alert: {
      borderRadius: '8px',
      backgroundColor: {
        primary: '#D1DEFA',
        success: '#F3FCF7',
        warning: '#FCF0CB',
        danger: '#FAE5E3',
      },
      borderColor: {
        primary: '#3868EC',
        success: colors.udbMainPositiveGreen,
        warning: colors.warning,
        danger: colors.danger,
      },
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
        borderColor: colors.udbMainPositiveGreen,
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
      zIndexPopup: zIndexDatePickerPopup,
    },
    timePicker: {
      zIndexPopup: zIndexTimePickerPopup,
    },
    link: {
      color: colors.udbMainDarkestBlue,
      hoverColor: colors.udbMainBlue,
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
        backgroundColor: colors.udbMainDarkBlue,
        borderColor: '#00417b',
        hoverBackgroundColor: colors.udbMainDarkestBlue,
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
      secondaryOutline: {
        color: colors.udbMainBlue,
        borderColor: colors.udbMainBlue,
        backgroundColor: colors.white,
        hoverBackgroundColor: '#E0F8FF',
        hoverBorderColor: '#007097',
        activeColor: '#333',
        activeBackgroundColor: '#e6e6e6',
        activeBorderColor: '#adadad',
      },
      success: {
        color: colors.white,
        borderColor: colors.udbMainPositiveGreen,
        hoverBackgroundColor: '#4E8E3E',
        hoverBorderColor: colors.udbMainPositiveGreen,
        backgroundColor: colors.udbMainPositiveGreen,
      },
      danger: {
        color: colors.white,
        borderColor: colors.red3,
        hoverBackgroundColor: '#9A2700',
        hoverBorderColor: colors.red4,
        backgroundColor: '#DD5242',
      },
    },
    card: {
      boxShadow: {
        small: '0px 2px 3px 0px rgba(210, 210, 210, 0.5)',
        medium: '0px 4px 16px 0px #00000012',
        large: '0px 4px 6px 0px rgba(210, 210, 210, 0.7)',
      },
    },
    global: {
      successColor: colors.udbMainPositiveGreen,
      warningIcon: colors.orange1,
      boxShadow: {
        heavy: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
      },
    },
    pagination: {
      color: colors.textColor,
      activeBackgroundColor: colors.udbMainDarkBlue,
      activeBorderColor: colors.udbMainDarkBlue,
      activeColor: colors.white,
      hoverBackgroundColor: colors.udbMainDarkestBlue,
      hoverBorderColor: colors.udbMainDarkestBlue,
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
        backgroundColor: colors.udbMainDarkBlue,
      },
      hover: {
        color: colors.white,
        backgroundColor: colors.udbMainDarkBlue,
      },
      highlight: {
        fontWeight: 'bold',
        backgroundColor: 'transparent',
      },
    },
    page: {
      backgroundColor: '#F5F5F5',
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
      color: colors.udbMainGrey,
      logoColor: colors.udbMainBlue,
      backgroundColor: colors.udbMainLightBlue,
    },
    jobLogger: {
      zIndex: zIndexJobLogger,
    },
    menu: {
      borderColor: colors.udbMainLightGrey,
    },
    menuItem: {
      active: {
        color: colors.udbMainBlue,
        backgroundColor: colors.udbMainMediumBlue,
      },
      hover: {
        backgroundColor: colors.udbMainMediumBlue,
        color: colors.udbMainDarkestGrey,
      },
    },
    announcement: {
      borderColor: colors.grey2,
      hoverBackgroundColor: colors.grey1,
      selected: {
        backgroundColor: colors.udbMainMediumBlue,
        hoverBackgroundColor: colors.udbMainMediumBlue,
      },
    },
    announcementList: {
      borderColor: colors.grey2,
    },
    announcementContent: {
      linkColor: colors.udbMainDarkBlue,
    },
    jobStatusIcon: {
      backgroundColor: colors.white,
      warning: {
        circleFillColor: colors.udbRed,
        remarkFillColor: colors.white,
      },
      busy: {
        spinnerStrokeColor: colors.udbMainDarkBlue,
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
      activeBackgroundColor: colors.udbMainDarkBlue,
    },
    eventItem: {
      borderColor: colors.grey3,
    },
    newFeatureTooltip: {
      backgroundColor: colors.grey6,
    },
    detailTable: {
      backgroundColor: colors.grey1,
      borderColor: colors.grey3,
    },
    loginPage: {
      backgroundColor: colors.white,
      footer: {
        backgroundColor: '#FAFAFB',
        linkColor: colors.udbMainDarkGrey,
      },
    },
    loginLogo: {
      backgroundColor: colors.udbMainLightBlue,
      color: colors.udbMainBlue,
      colorSoft: lighten('0.23', colors.udbMainBlue),
      colorMedium: lighten('0.31', colors.udbMainBlue),
      colorHard: lighten('0.40', colors.udbMainBlue),
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
        backgroundColor: colors.udbMainGrey,
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
      imageIconColor: 'pink',
      imageBackgroundColor: colors.grey1,
      mainImageBackgroundColor: colors.udbMainLightBlue,
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
      imageBackgroundColor: colors.grey1,
      mainImageBackgroundColor: colors.udbMainLightBlue,
    },
    toggleBox: {
      backgroundColor: colors.white,
      activeBackgroundColor: colors.udbMainLightGreen,
      activeBorderColor: colors.udbMainPositiveGreen,
      borderColor: '#8F9699',
      textColor: colors.udbMainDarkGrey,
      activeTextColor: colors.textColor,
      iconColor: colors.grey5,
      iconCheckColor: colors.udbMainPositiveGreen,
      boxShadow: {
        small: '0px 2px 3px 0px rgba(210, 210, 210, 0.5)',
        large: '0px 4px 6px 0px rgba(210, 210, 210, 0.7)',
      },
      hoverBorderColor: colors.udbMainPositiveGreen,
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
    offerScore: {
      link: colors.textColor,
    },
    richTextEditor: {
      borderColor: colors.grey1,
    },
  },
} as const;

type Theme = typeof theme;

const getValueFromTheme =
  (component: string) => (path: string) => (props: { theme: Theme }) =>
    get(props.theme, `components.${component}.${path}`);

export {
  Breakpoints,
  colors,
  getGlobalBorderRadius,
  getGlobalFormInputHeight,
  getValueFromTheme,
  theme,
};
export type { BreakpointValues, Theme };
