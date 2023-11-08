/* eslint-disable react/no-unescaped-entities */
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import { useMatchBreakpoint } from '@/hooks/useMatchBreakpoint';
import { SupportedLanguages } from '@/i18n/index';
import { Footer, FooterVariants } from '@/pages/Footer';
import { Box } from '@/ui/Box';
import { Button, ButtonSizes } from '@/ui/Button';
import { CustomIcon, CustomIconVariants } from '@/ui/CustomIcon';
import { Inline } from '@/ui/Inline';
import { Link } from '@/ui/Link';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import {
  Breakpoints,
  colors,
  getGlobalBorderRadius,
  getValueFromTheme,
} from '@/ui/theme';

import { ManIllustrationSvg } from './illustrations/ManIllustration';
import { WomanIllustrationSvg } from './illustrations/WomanIllustration';

const getValueForPage = getValueFromTheme('loginPage');

const UDBLogo = ({ ...props }) => {
  return (
    <Stack {...getStackProps(props)}>
      <svg
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        viewBox="0 0 172 34"
      >
        <path
          d="M19.45 19.682c0 2.284-.243 4.127-1.979 5.768-1.557 1.47-3.453 1.983-5.354 2.148-1.656.147-3.822-.108-5.22-1.098-1.922-1.397-2.29-3.47-2.29-6.104V5.836l5.642.476v13.195c0 .704-.028 1.662.34 2.296.425.657 1.267.894 1.984.86.63-.032 1.42-.276 1.894-.772.712-.715.631-1.777.631-2.729V6.715l4.353.367-.001 12.6Zm6.935-7.677-5.224-.235V7.225l5.223.44v4.34h.001Zm0 13.996-5.224.433V13.265l5.223.166v12.57h.001Zm10.41-.784-5.268.445V12.324l-3.797-.167V7.778l12.784 1.074v3.861l-3.719-.16v12.665ZM.155 0h55.794v33.83H.154l44.634-5.638V5.639L.154 0Zm74.602 25.657h-4.458v-1.628c-.66 1.254-1.748 1.88-3.265 1.88-1.399 0-2.533-.551-3.403-1.655-.87-1.105-1.306-2.709-1.306-4.812 0-1.966.438-3.528 1.312-4.685.874-1.157 2.03-1.734 3.469-1.734 1.199 0 2.188.462 2.967 1.387V9.219h4.684v16.438Zm-4.684-7.877c0-1.1-.45-1.65-1.348-1.65-.627 0-1.038.35-1.233 1.048-.194.7-.291 1.553-.291 2.566 0 1.984.5 2.975 1.502 2.975.381 0 .704-.157.97-.47.267-.314.4-.79.4-1.433V17.78Zm19.403 7.877h-4.528a8.13 8.13 0 0 1-.167-1.709c-.86 1.308-2.158 1.962-3.898 1.962-1.431 0-2.503-.37-3.214-1.108-.712-.74-1.066-1.587-1.066-2.542 0-1.294.582-2.34 1.746-3.138 1.164-.798 3.228-1.277 6.192-1.44v-.277c0-.538-.12-.894-.363-1.071-.243-.177-.6-.265-1.066-.265-1.097 0-1.708.446-1.836 1.336l-4.34-.408c.62-2.561 2.729-3.841 6.33-3.841.977 0 1.875.098 2.693.296.819.196 1.465.503 1.942.92.477.418.798.859.96 1.324.163.465.245 1.36.245 2.685v4.888c0 .934.123 1.728.37 2.387Zm-4.934-5.735c-2.025.22-3.038.873-3.038 1.965 0 .738.402 1.106 1.203 1.106.509 0 .942-.152 1.3-.456.357-.305.535-.982.535-2.025v-.59Zm14.518-6.514v3.12h-2.42v4.516c0 .617.115.985.345 1.101.231.118.469.175.715.175.382 0 .835-.068 1.36-.203v3.42c-.938.186-1.862.276-2.767.276-1.462 0-2.536-.316-3.225-.95-.686-.634-1.03-1.646-1.03-3.036l.012-1.432v-3.867H90.24V13.41h1.812l.072-3.986 4.516-.07v4.059h2.422l-.001-.004Zm13.992 12.249h-4.528a8.212 8.212 0 0 1-.167-1.709c-.857 1.308-2.157 1.962-3.897 1.962-1.431 0-2.501-.37-3.212-1.108-.712-.74-1.067-1.587-1.067-2.542 0-1.294.581-2.34 1.746-3.138s3.228-1.277 6.192-1.44v-.277c0-.538-.122-.894-.364-1.071-.243-.178-.599-.265-1.066-.265-1.098 0-1.71.446-1.835 1.336l-4.34-.408c.619-2.561 2.729-3.841 6.329-3.841.98 0 1.875.098 2.695.296.819.196 1.465.503 1.942.92.477.418.797.859.96 1.324.164.465.245 1.36.245 2.685v4.888c-.002.934.12 1.728.368 2.387h-.001Zm-4.934-5.735c-2.027.22-3.038.873-3.038 1.965 0 .738.4 1.106 1.203 1.106.507 0 .94-.152 1.297-.456.36-.305.538-.982.538-2.025v-.59Zm9.739 5.735h-2.684V9.219h4.686v5.647c.651-1.14 1.688-1.71 3.11-1.71 1.001 0 1.852.264 2.551.794.699.53 1.22 1.286 1.56 2.27.344.983.513 2.018.513 3.101 0 1.976-.436 3.57-1.311 4.775-.873 1.208-2.178 1.813-3.909 1.813-1.709 0-3.007-.647-3.898-1.94a7.665 7.665 0 0 0-.618 1.687Zm2.002-4.566c0 1.206.46 1.81 1.381 1.81.502 0 .885-.22 1.152-.658.265-.438.398-1.338.398-2.704 0-1.485-.151-2.419-.452-2.8-.303-.381-.675-.572-1.122-.572-.349 0-.663.136-.94.41-.278.274-.417.67-.417 1.192v3.322Zm21.846 4.566h-4.53a8.21 8.21 0 0 1-.168-1.709c-.857 1.308-2.154 1.962-3.895 1.962-1.431 0-2.503-.37-3.212-1.108-.712-.74-1.067-1.587-1.067-2.542 0-1.294.582-2.34 1.746-3.138 1.164-.798 3.229-1.277 6.192-1.44v-.277c0-.538-.123-.894-.365-1.071-.241-.178-.597-.265-1.067-.265-1.096 0-1.707.446-1.835 1.336l-4.338-.408c.62-2.561 2.729-3.841 6.328-3.841.979 0 1.875.098 2.695.296.819.196 1.465.503 1.942.92.477.418.797.859.96 1.324.162.465.243 1.36.243 2.685v4.888c0 .934.124 1.729.371 2.388Zm-4.934-5.735c-2.026.22-3.041.873-3.041 1.965 0 .738.402 1.106 1.204 1.106.509 0 .943-.152 1.3-.456.356-.305.536-.982.536-2.025l.001-.59Zm18.866 5.735h-4.755v-7.709c0-.634-.098-1.04-.293-1.216a1.052 1.052 0 0 0-.733-.264c-.866 0-1.299.61-1.299 1.83v7.359h-4.756V13.41h4.411v1.734c.651-1.325 1.815-1.988 3.491-1.988.884 0 1.627.17 2.235.511.611.34 1.044.782 1.305 1.324.263.541.394 1.482.394 2.825v7.84Zm15.031-12.249-3.665 4.208 4.081 8.04h-4.915l-2.275-4.906-1.298 1.533v3.373h-4.456V9.219h4.458v6.634c0 .186-.012.923-.033 2.216.284-.41.575-.783.868-1.12l3.044-3.54h4.191Z"
          fill="#009FDF"
        />
      </svg>
    </Stack>
  );
};

const OvalSvg = ({ ...props }: StackProps) => {
  return (
    <Stack {...getStackProps(props)}>
      <svg
        width="100%"
        viewBox="0 0 1440 651"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1836 -41C1836 341.181 1336.57 651 720.5 651C104.426 651 -395 341.181 -395 -41C-395 -423.181 104.426 -733 720.5 -733C1336.57 -733 1836 -423.181 1836 -41Z"
          fill="url(#paint0_linear_1029_908)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1029_908"
            x1="720"
            y1="320"
            x2="720.5"
            y2="651"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#F3FBFF" stop-opacity="0" />
            <stop offset="1" stop-color="#F3FBFF" />
            <stop offset="1" stop-color="#F3FBFF" />
          </linearGradient>
        </defs>
      </svg>
    </Stack>
  );
};

type USPCardProps = {
  icon: JSX.Element;
  quantity: string;
  title: string;
  text: string | React.ReactElement;
  rotateDegree?: string;
} & StackProps;

const USPCard = ({
  icon,
  quantity,
  title,
  text,
  rotateDegree,
  ...props
}: USPCardProps) => {
  const isSmallView = useMatchBreakpoint(Breakpoints.S);
  return (
    <Stack
      borderRadius={getGlobalBorderRadius}
      backgroundColor={colors.white}
      alignItems="center"
      padding={5}
      spacing={3}
      css={css`
        box-shadow: 0px 4px 40px 0px #c6e0eb80;
        transform: ${isSmallView ? 'none' : `rotate(${rotateDegree ?? 0}`} );
      `}
      {...getStackProps(props)}
    >
      {icon}
      <Text
        color="#141515"
        fontSize="1.5rem"
        fontWeight="bold"
        css={`
          letter-spacing: 0.05em;
        `}
      >
        {quantity} <Text color={colors.udbMainBlue}>+</Text>
      </Text>
      <Text
        textAlign="center"
        lineHeight="2rem"
        fontWeight="600"
        fontSize="1.15rem"
      >
        {title}
      </Text>
      <Text>{text}</Text>
    </Stack>
  );
};

type UDBCardProps = {
  onLogin: () => void;
} & StackProps;

const UDBCard = ({ onLogin, ...props }: UDBCardProps) => {
  const { t } = useTranslation();

  const isSmallView = useMatchBreakpoint(Breakpoints.S);

  return (
    <Stack
      flex={1}
      spacing={4}
      paddingTop={5}
      paddingBottom={5}
      paddingLeft={3}
      paddingRight={3}
      backgroundColor={colors.white}
      alignItems="center"
      css={css`
        box-shadow: 0px 4px 40px 0px #c6e0eb80;
        left: 50%;
        top: 180px;
        transform: ${isSmallView ? 'none' : 'translate(-50%, -50%)'};
      `}
      {...getStackProps(props)}
    >
      <Stack alignItems="center">
        <UDBLogo width="80%" />
        <Box as="h1" display="none">
          {t('brand')}
        </Box>
      </Stack>
      <Text
        textAlign="center"
        fontWeight="bold"
        fontSize="1.5rem"
        color="#6A6E70"
      >
        {t('main.lead')}
      </Text>
      <Text textAlign="center">{t('main.lead_sub')}</Text>
      <Button onClick={onLogin} size={ButtonSizes.LARGE}>
        {t('main.start')}
      </Button>
    </Stack>
  );
};

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

    router.push('/api/auth/login');
  };

  useRedirectToLanguage();

  const isMediumView = useMatchBreakpoint(Breakpoints.M);
  const isSmallView = useMatchBreakpoint(Breakpoints.S);
  const isLargeView = useMatchBreakpoint(Breakpoints.L);
  const isXLargeView = useMatchBreakpoint(Breakpoints.XL);

  const uspCardWidth = useMemo(() => {
    if (isSmallView) return '100%';
    if (isMediumView) return '35%';
    if (isLargeView) return '30%';
    if (isXLargeView) return '20%';
    return '25%';
  }, [isLargeView, isMediumView, isSmallView, isXLargeView]);

  const uspCardBottomPosition = useMemo(() => {
    if (isMediumView) return '-40vh';
    if (isLargeView) return '-35vh';

    return '-28vh';
  }, [isLargeView, isMediumView]);

  return (
    <Stack
      width="100%"
      alignItems="center"
      spacing={6}
      backgroundColor={getValueForPage('backgroundColor')}
    >
      <Stack width="100%" height={isSmallView ? 'auto' : 800}>
        <Inline
          width="100%"
          padding={isSmallView ? 4 : 6.5}
          justifyContent="space-between"
          alignItems="flex-start"
          position="relative"
          stackOn={Breakpoints.S}
          spacing={isSmallView ? 4 : 0}
        >
          <OvalSvg
            width="100%"
            position="absolute"
            top={isMediumView ? '20%' : '-10%'}
            left={0}
          />
          {!isSmallView && <ManIllustrationSvg zIndex={3} width={'35%'} />}

          <UDBCard
            zIndex={1}
            position={isSmallView ? 'static' : 'absolute'}
            borderRadius={getGlobalBorderRadius}
            onLogin={handleClickLogin}
            width={isSmallView ? '100%' : '30%'}
          />
          {!isSmallView && <WomanIllustrationSvg zIndex={3} width={'35%'} />}

          <Inline
            width="100%"
            justifyContent="center"
            padding={isSmallView ? 0 : 5}
            position={isSmallView ? 'static' : 'absolute'}
            left={0}
            bottom={uspCardBottomPosition}
            zIndex={1}
            stackOn={Breakpoints.S}
            spacing={isSmallView ? 3 : 0}
          >
            <USPCard
              width={uspCardWidth}
              icon={
                <CustomIcon
                  name={CustomIconVariants.PHYSICAL}
                  color={colors.udbMainBlue}
                  width="32"
                />
              }
              quantity="215.000"
              title={t('main.activities')}
              text={t('main.activities_info')}
              rotateDegree="7.34deg"
            />
            <USPCard
              width={uspCardWidth}
              icon={
                <CustomIcon
                  name={CustomIconVariants.PHONE}
                  color={colors.udbMainBlue}
                  width="32"
                />
              }
              quantity="1.000"
              title={t('main.channels')}
              text={
                <Trans i18nKey="main.channels_info">
                  De UiTdatabank levert informatie aan meer dan 1.000 online
                  agenda's, apps en gedrukte bladen.
                  <MainChannelLink />
                </Trans>
              }
              rotateDegree="-5.75deg"
            />
            <USPCard
              width={uspCardWidth}
              icon={
                <CustomIcon
                  name={CustomIconVariants.BADGE}
                  color={colors.udbMainBlue}
                  width="32"
                />
              }
              quantity="28.000"
              title={t('main.organizers')}
              text={t('main.organizers_info')}
              rotateDegree="4.88deg"
            />
          </Inline>
        </Inline>
      </Stack>

      <Inline
        width="100%"
        backgroundColor={getValueForPage('footer.backgroundColor')}
        justifyContent="center"
      >
        <Footer
          isProfileLinkVisible={false}
          onChangeLanguage={handleChangeLanguage}
          variant={FooterVariants.LOGIN}
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
