import { css } from 'styled-components';

import { getValueFromTheme } from '../theme';

const getValue = getValueFromTheme('link');

const linkCSS = css`
  color: ${getValue('color')};

  :hover {
    color: ${getValue('color')};
    text-decoration: underline;
  }

  display: 'inline-flex';
  font-weight: 400;
`;

export { linkCSS };
