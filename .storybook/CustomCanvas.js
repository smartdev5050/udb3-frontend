import { Canvas } from '@storybook/addon-docs/blocks';
import { styled } from '@storybook/theming';

const SyledCanvas = styled(Canvas)`
  .plain-text {
    color: #ffffff;
  }
`;

export { SyledCanvas as CustomCanvas };
