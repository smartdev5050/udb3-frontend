import type { ElementType } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@/ui/Box';
import { Button, ButtonVariants } from '@/ui/Button';
import { Image } from '@/ui/Image';
import { Inline } from '@/ui/Inline';
import { Link } from '@/ui/Link';
import { List } from '@/ui/List';
import { Stack } from '@/ui/Stack';

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
  wrapper?: ElementType;
  onChangeLanguage?: (language: string) => () => Promise<boolean>;
  isLogoVisible?: boolean;
  isLanguageSwitcherVisible?: boolean;
};

const Footer = ({
  wrapper: Wrapper,
  onChangeLanguage,
  isLogoVisible,
  isLanguageSwitcherVisible,
}: Props) => {
  const { t, i18n } = useTranslation();

  return (
    <Wrapper>
      <Stack alignItems="flex-start">
        <List alignItems={{ xs: 'center' }}>
          <List.Item>
            <FooterLink href="mailto:vragen@uitdatabank.be">
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
        </List>
      </Stack>

      <Stack
        spacing={3}
        alignItems={{ default: 'flex-end', xs: 'center' }}
        justifyContent="flex-start"
      >
        <Inline as="p" spacing={2} className="footer-by">
          <Box as="span">{t('footer.by')}</Box>
          <FooterLink href="http://www.publiq.be">publiq vzw</FooterLink>
        </Inline>
        {isLogoVisible && (
          <Image
            alt="logo vlaanderen"
            src={`/assets/${t('main.flanders_image')}`}
            width={150}
          />
        )}
        {isLanguageSwitcherVisible && (
          <Inline>
            <LanguageSwitcherButton onClick={onChangeLanguage('nl')}>
              Nederlands
            </LanguageSwitcherButton>
            <LanguageSwitcherButton
              variant={ButtonVariants.UNSTYLED}
              onClick={onChangeLanguage('fr')}
            >
              Français
            </LanguageSwitcherButton>
          </Inline>
        )}
      </Stack>
    </Wrapper>
  );
};

Footer.defaultProps = {
  isLogoVisible: true,
  isLanguageSwitcherVisible: true,
  wrapper: (props) => (
    <Inline width="100%" justifyContent="space-between" {...props} />
  ),
};

export { Footer };
