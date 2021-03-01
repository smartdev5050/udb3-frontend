import { render } from '@testing-library/react';
import { TestApp } from './TestApp';

const renderPageWithWrapper = (Page) => render(Page, { wrapper: TestApp });

export { renderPageWithWrapper };
