import PropTypes from 'prop-types';

import { ThemeProvider } from '@/ui/ThemeProvider';
import NextHead from 'next/head';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from '@/i18n/index';
import { CookiesProvider, Cookies } from 'react-cookie';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';

import { cloneElement } from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { GlobalStyle } from '@/styles/GlobalStyle';

import Layout from '@/layouts/index';
import { ContextProvider } from '@/pages/ContextProvider';

config.autoAddCss = false;

const Head = () => {
  const { t } = useTranslation();

  return (
    <NextHead>
      <meta
        key="viewport"
        name="viewport"
        content="initial-scale=1.0, width=device-width"
      />
      <link
        key="icon"
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon.png"
      />
      <title key="title">UiTDatabank</title>
      <meta name="description" content={t('description')} />
    </NextHead>
  );
};

const queryClient = new QueryClient();

const isServer = () => typeof window === 'undefined';

const App = ({ Component, pageProps, children }) => {
  return (
    <>
      <GlobalStyle />
      <Head />
      <ContextProvider
        providers={[
          [I18nextProvider, { i18n }],
          ThemeProvider,
          [
            CookiesProvider,
            {
              cookies: isServer()
                ? new Cookies(pageProps.cookies ?? '')
                : undefined,
            },
          ],
          [QueryClientProvider, { client: queryClient }],
          [Hydrate, { state: pageProps?.dehydratedState ?? {} }],
        ]}
      >
        <Layout>
          {children ? (
            cloneElement(children, { ...children.props, ...pageProps })
          ) : (
            <Component {...pageProps} />
          )}
        </Layout>
      </ContextProvider>
    </>
  );
};

App.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  pageProps: PropTypes.object,
  children: PropTypes.node,
};

export default App;
