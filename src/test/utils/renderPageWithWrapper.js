import { render } from '@testing-library/react';
import App from '@/pages/_app';

const renderPageWithWrapper = (Page) => render(Page, { wrapper: App });

export { renderPageWithWrapper };
