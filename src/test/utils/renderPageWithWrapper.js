import { render } from '@testing-library/react';

import App from '@/pages/_app.page';

const renderPageWithWrapper = (Page) => render(Page, { wrapper: App });

export { renderPageWithWrapper };
