import { createGlobalStyle } from 'styled-components';

import { colors as globalColors, getValueFromTheme, theme } from '@/ui/theme';

const getValueForModal = getValueFromTheme('modal');
const getButtonValue = getValueFromTheme('button');

const GlobalStyle = createGlobalStyle`
  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  .h1,
  .h2,
  .h3,
  .h4,
  .h5,
  .h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video,
  input {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }

  ol,
  ul {
    list-style: none;
  }

  blockquote,
  q {
    quotes: none;
  }

  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: '';
    content: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  a {
    color: inherit;

    &:hover {
      color: inherit;
      text-decoration: none;
    }
  }

  a:hover {
    cursor: pointer;
  }

  html {
    color: #222;
    font-size: 15px;
    line-height: 1.6;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
  }

  .modal-backdrop {
    z-index: ${getValueForModal('zIndexBackdrop')};
  }

  .badge-secondary {
    background-color: ${globalColors.grey5};
  }
  
  .progress-bar.bg-success {
    background-color: ${globalColors.udbMainPositiveGreen} !important;
  }

  .dropdown-menu {
    padding: 0;
  }

  .public-DraftEditor-content {
    overflow-wrap: anywhere !important;
  }

  .rdw-editor-toolbar {
    border-width: 0 0 1px;
    background-color: hsl(0, 0%, 98%);
    margin-bottom: 0;
  }

  .rdw-editor-main {
    padding: 10px;
    padding-top: 0;
  }

  .rdw-option-wrapper {
    border-radius: 8px;
    padding: 1rem 0.8rem;
  }

  .public-DraftStyleDefault-block {
    margin: 0.5em 0;
  }

  .rdw-link-decorator-wrapper {
    text-decoration: underline;
    color: var(--primary)
  }

  .rdw-link-modal {
    height: auto;
    border-radius: ${theme.borderRadius};
    box-shadow: ${getButtonValue('boxShadow.small')};
    
    .rdw-link-modal-label {
      font-weight: bold;
    }

    .rdw-link-modal-input {
      border-radius: ${theme.borderRadius};
      height: ${theme.formInputHeight};
    }
  }

  .rdw-link-modal-btn {
    border-radius: ${getButtonValue('borderRadius')};
    padding: ${getButtonValue('paddingY')} ${getButtonValue('paddingX')};
    border: none;
    box-shadow: ${getButtonValue('boxShadow.small')};
    height: ${theme.formInputHeight};

    &:first-child {
      color: white;
      background-color: ${getButtonValue('primary.backgroundColor')};
    }

    &:last-child {
      color: ${getButtonValue('secondary.color')};
      background-color: ${getButtonValue('secondary.backgroundColor')};
      box-shadow: ${getButtonValue('boxShadow.heavy')};

    }
  }

  .rdw-link-decorator-icon {
    display: none;
  }
`;

export { GlobalStyle };
