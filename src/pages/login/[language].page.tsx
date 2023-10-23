/* eslint-disable react/no-unescaped-entities */
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { css, keyframes } from 'styled-components';

import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import { SupportedLanguages } from '@/i18n/index';
import { Footer } from '@/pages/Footer';
import { Box } from '@/ui/Box';
import { Button, ButtonSizes } from '@/ui/Button';
import { Inline } from '@/ui/Inline';
import { Link } from '@/ui/Link';
import { Stack } from '@/ui/Stack';
import { Breakpoints, colors, getValueFromTheme } from '@/ui/theme';

const getValueForPage = getValueFromTheme('loginPage');
const getValueForLogo = getValueFromTheme('loginLogo');

const Column = ({ value, title, children, ...props }) => (
  <Stack as="article" flex={1} spacing={4} {...props}>
    <Stack as="blockquote" alignItems="center">
      <Box as="p" fontSize="4rem" fontWeight={300} lineHeight="4rem">
        {value}
      </Box>
      <Box as="h2" fontSize="1.2rem">
        {title}
      </Box>
    </Stack>
    <Box as="p" textAlign={{ m: 'center' }}>
      {children}
    </Box>
  </Stack>
);

Column.propTypes = {
  value: PropTypes.string,
  title: PropTypes.string,
  info: PropTypes.string,
  children: PropTypes.node,
};

const useRedirectToLanguage = () => {
  const router = useRouter();
  const language = Array.isArray(router.query?.language)
    ? router.query.language[0]
    : router.query.language;
  const { i18n } = useTranslation();

  const { setCookie } = useCookiesWithOptions();

  useEffect(() => {
    if (!language) return;

    if (SupportedLanguages[language.toUpperCase()]) {
      i18n.changeLanguage(language);
      setCookie('udb-language', language);
    } else {
      router.push('/login/nl');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);
};

const ResponsiveContainer = (props) => (
  <Inline
    maxWidth={{ default: 1170, l: 970, m: 750 }}
    paddingX={{ default: 4, m: 6, s: 6 }}
    width="100%"
    {...props}
  />
);

const MainChannelLink = () => {
  const { t } = useTranslation();
  return (
    <Link
      css={`
      display: inline
      text-decoration: underline;
      color: #555;
      &:hover {
        color: #222;
      }
    `}
      href={t('main.channels_info_link_url')}
    >
      {t('main.channels_info_link_text')}
    </Link>
  );
};

const Index = () => {
  const { query, ...router } = useRouter();
  const { t, i18n } = useTranslation();
  const { publicRuntimeConfig } = getConfig();
  const { setCookie } = useCookiesWithOptions();

  const handleChangeLanguage = (language: string) => async () =>
    router.push(`/login/${language}`, undefined, { shallow: true });

  const handleClickLogin = () => {
    const { referer } = query;

    const fallbackUri = new URL(`${publicRuntimeConfig.baseUrl}/dashboard`);
    fallbackUri.searchParams.set('tab', 'events');

    const redirectUri = referer ?? fallbackUri.toString();

    setCookie('auth0.redirect_uri', redirectUri);

    window.location.assign('/api/auth/login');
  };

  useRedirectToLanguage();

  return (
    <Stack
      width="100%"
      alignItems="center"
      spacing={6}
      backgroundColor={getValueForPage('backgroundColor')}
    >
      <Stack
        height="1200px"
        className="some-wrapper"
        css={`
          :before {
            position: absolute;
            content: '';
            width: 100%;
            top: -500px;
            left: 0;
            height: 1200px;
            border-radius: 40%;
            background: linear-gradient(
              179.86deg,
              rgba(243, 251, 255, 0) 0%,
              #f3fbff 100%,
              #f3fbff 100%
            );
          }
        `}
      >
        <p>Hello</p>
      </Stack>
      <Inline width="100%" backgroundColor="#ccc" justifyContent="center">
        <Footer
          isProfileLinkVisible={false}
          onChangeLanguage={handleChangeLanguage}
          wrapper={(props) => (
            <ResponsiveContainer
              justifyContent={{ default: 'space-between', xs: 'flex-start' }}
              alignItems={{ xs: 'center' }}
              stackOn={Breakpoints.XS}
              spacing={5}
              paddingY={5}
              {...props}
            />
          )}
        />
      </Inline>
    </Stack>
  );
};

export const getServerSideProps = () => ({ props: {} });

export default Index;
