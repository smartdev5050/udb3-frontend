import type { ElementType } from 'react';
import { useTranslation } from 'react-i18next';

import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import type { Values } from '@/types/Values';
import { Box } from '@/ui/Box';
import { Button, ButtonVariants } from '@/ui/Button';
import { Image } from '@/ui/Image';
import { Inline } from '@/ui/Inline';
import { Link } from '@/ui/Link';
import { List } from '@/ui/List';
import { Stack } from '@/ui/Stack';

import { SupportedLanguages } from '../i18n';

const allowedLanguageToggles = Object.values(SupportedLanguages).filter(
  (language) => language !== 'en',
);

const LanguageSwitcherButton = (props) => (
  <Button
    {...props}
    variant={ButtonVariants.UNSTYLED}
    css={`
      text-decoration: underline;
      color: #004f94;
      &:hover {
        color: #222;
      }
    `}
  />
);

const FooterLink = (props) => (
  <Link
    {...props}
    css={`
      text-decoration: underline;
      color: #555;
      &:hover {
        color: #222;
      }
    `}
  />
);

type Props = {
  isProfileLinkVisible: boolean;
  wrapper?: ElementType;
  onChangeLanguage?: (
    language: Values<typeof SupportedLanguages>,
  ) => () => Promise<boolean>;
};

const Footer = ({
  wrapper: Wrapper,
  onChangeLanguage,
  isProfileLinkVisible,
  ...props
}: Props) => {
  const { t, i18n } = useTranslation();
  const { setCookie } = useCookiesWithOptions(['udb-language']);

  const defaultHandleChangeLanguage = (
    language: Values<typeof SupportedLanguages>,
  ) => () => {
    setCookie('udb-language', language);
  };

  const handleChangeLanguage = onChangeLanguage ?? defaultHandleChangeLanguage;

  return (
    <Wrapper {...props}>
      <Stack alignItems="flex-start">
        <List alignItems={{ xs: 'center' }}>
          <List.Item>
            <FooterLink href="https://helpdesk.publiq.be/hc/nl/categories/360001783039-UiTdatabank">
              {t('footer.contact')}
            </FooterLink>
          </List.Item>
          <List.Item>
            <FooterLink href="http://www.publiq.be/nl/project/uitdatabank">
              {t('footer.about')}
            </FooterLink>
          </List.Item>
          <List.Item>
            <FooterLink href="http://documentatie.uitdatabank.be">
              {t('footer.dev')}
            </FooterLink>
          </List.Item>
          <List.Item>
            <Inline spacing={3}>
              <FooterLink
                href={`http://www.publiq.be/${i18n.language}/${t(
                  'footer.legal_path',
                )}`}
              >
                {t('footer.legal')}
              </FooterLink>
              <FooterLink href="http://www.publiq.be/nl/privacy-uitdatabank">
                {t('footer.privacy')}
              </FooterLink>
            </Inline>
          </List.Item>
          {isProfileLinkVisible && (
            <List.Item>
              <FooterLink
                href={`https://profile.uitid.be/${i18n.language}/profile`}
              >
                {t('footer.profile')}
              </FooterLink>
            </List.Item>
          )}
        </List>
      </Stack>

      <Stack
        spacing={3}
        alignItems={{ default: 'flex-end', xs: 'center' }}
        justifyContent="flex-start"
      >
        <Inline as="p" spacing={2} color="#555">
          <Box as="span">{t('footer.by')}</Box>
          <FooterLink href="http://www.publiq.be">publiq vzw</FooterLink>
        </Inline>
        <Image
          alt="logo vlaanderen"
          src={`/assets/${t('main.flanders_image')}`}
          width={150}
        />
        <Inline>
          {allowedLanguageToggles.map((allowedLanguage, index) => {
            return (
              <LanguageSwitcherButton
                key={index}
                onClick={handleChangeLanguage(allowedLanguage)}
              >
                {t(`footer.${allowedLanguage}`)}
              </LanguageSwitcherButton>
            );
          })}
        </Inline>
      </Stack>
    </Wrapper>
  );
};

const Wrapper = (props) => (
  <Inline width="100%" justifyContent="space-between" {...props} />
);

Footer.defaultProps = {
  isProfileLinkVisible: true,
  wrapper: Wrapper,
};

export { Footer };
