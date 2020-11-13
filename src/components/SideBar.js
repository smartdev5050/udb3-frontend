import { Stack } from './publiq-ui/Stack';
import { Link } from './publiq-ui/Link';
import { useTranslation } from 'react-i18next';
import { Icon, IconVariants } from './publiq-ui/Icon';
import { getValueFromTheme } from './publiq-ui/theme';

const SideBar = () => {
  const { t } = useTranslation();

  const getValueForLink = getValueFromTheme('sideBarLink');
  const getValueForSideBar = getValueFromTheme('sideBar');

  const StyledLink = (props) => (
    <Link
      {...props}
      padding={2}
      css={`
        width: 100%;
        display: inline-block;
        align-items: center;
        text-decoration: none;
        color: ${getValueForLink('color')};

        &:hover {
          color: ${getValueForLink('hover.color')};
          background-color: ${getValueForLink('hover.backgroundColor')};
          text-decoration: none;
        }
      `}
    />
  );

  return (
    <Stack
      css={`
        position: relative;
        width: 230px;
        background-color: ${getValueForSideBar('backgroundColor')};
        height: 100vh;
        color: ${getValueForSideBar('color')};
        text-align: left;
        z-index: 2000;
        padding: 5px;
      `}
    >
      <Link href="/dashboard">
        <img
          src="/assets/udb-logo.svg"
          alt="Uitdatabank"
          className="udb-logo"
        />
        <img
          src="/assets/udb-logo-mobile.svg"
          alt="Uitdatabank"
          className="udb-logo-mobile"
          css="display: none;"
        />
      </Link>
      <Stack as="ul" margin={3} marginBottom={6}>
        <li>
          <StyledLink href="/dashboard">
            <Icon variant={IconVariants.HOME} marginRight={3} />
            <span>{t('menu.home')}</span>
          </StyledLink>
        </li>
        <li>
          <StyledLink href="/event">
            <Icon variant={IconVariants.PLUS_CIRCLE} marginRight={3} />
            <span>{t('menu.add')}</span>
          </StyledLink>
        </li>
        <li>
          <StyledLink href="/search">
            <Icon variant={IconVariants.SEARCH} marginRight={3} />
            <span>{t('menu.search')}</span>
          </StyledLink>
        </li>
      </Stack>
      <Stack
        as="ul"
        css={`
          border-top: 1px solid #900d09;
        `}
      >
        <p>{t('menu.management')}</p>
        <li>
          <StyledLink href="/manage/moderation/overview">
            <Icon variant={IconVariants.FLAG} marginRight={3} />
            <span>{t('menu.validate')}</span>
          </StyledLink>
        </li>
        <li>
          <StyledLink href="/manage/users/overview">
            <Icon variant={IconVariants.USER} marginRight={3} />
            <span>{t('menu.users')}</span>
          </StyledLink>
        </li>
        <li>
          <StyledLink href="/manage/roles/overview">
            <Icon variant={IconVariants.USERS} marginRight={3} />
            <span>{t('menu.roles')}</span>
          </StyledLink>
        </li>
        <li>
          <StyledLink href="/manage/labels/overview">
            <Icon variant={IconVariants.TAG} marginRight={3} />
            <span>{t('menu.labels')}</span>
          </StyledLink>
        </li>
        <li>
          <StyledLink href="/manage/organizations">
            <Icon variant={IconVariants.SLIDE_SHARE} marginRight={3} />
            <span>{t('menu.organizations')}</span>
          </StyledLink>
        </li>
        <li>
          <StyledLink href="/manage/productions">
            <Icon variant={IconVariants.LAYER_GROUP} marginRight={3} />
            <span>{t('menu.productions')}</span>
          </StyledLink>
        </li>
      </Stack>
    </Stack>
  );
};

export { SideBar };
