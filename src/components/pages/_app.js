import { FeatureFlags } from '@/constants/FeatureFlags';
import { defaultCookieOptions } from '@/hooks/useCookiesWithOptions';
import { createCookieName } from '@/hooks/useFeatureFlag';
import i18n from '@/i18n/index';
import Layout from '@/layouts/index';
import { GlobalStyle } from '@/styles/GlobalStyle';
import { ThemeProvider } from '@/ui/ThemeProvider';
import { initializeSentry } from '@/utils/sentry';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import NextHead from 'next/head';
import PropTypes from 'prop-types';
import { cloneElement } from 'react';
import { Cookies, CookiesProvider } from 'react-cookie';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Hydrate } from 'react-query/hydration';

const cookies = new Cookies();

if (typeof window !== 'undefined') {
  window.FeatureFlags = FeatureFlags;
  window.setFeatureFlag = (featureFlagName, value) => {
    cookies.set(createCookieName(featureFlagName), value, defaultCookieOptions);
  };
}

const ContextProvider = ({ providers, children }) => {
  return providers.reverse().reduce((AccumulatedProviders, current) => {
    const [CurrentProvider, currentProps] = Array.isArray(current)
      ? current
      : [current, {}];
    // eslint-disable-next-line react/prop-types
    return (
      <CurrentProvider {...currentProps}>
        {AccumulatedProviders}
      </CurrentProvider>
    );
  }, children);
};

ContextProvider.propTypes = {
  providers: PropTypes.array,
  children: PropTypes.node,
};

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
initializeSentry();

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
        <ReactQueryDevtools initialIsOpen={false} />
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
