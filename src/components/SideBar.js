import { Stack } from './publiq-ui/Stack';
import { Link } from './publiq-ui/Link';
import { useTranslation } from 'react-i18next';
import { Icon, IconVariants } from './publiq-ui/Icon';

const SideBar = () => {
  const { t } = useTranslation();
  return (
    <Stack
      css={`
        position: relative;
        width: 230px;
        background-color: #c0120c;
        height: 100vh;
        color: #fff;
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
        />
      </Link>
      <Stack as="ul">
        <li>
          <Link href="/dashboard">
            <Icon variant={IconVariants.HOME} marginRight={3} />
            <span>{t('menu.home')}</span>
          </Link>
        </li>
        <li>
          <Link href="/event">
            <Icon variant={IconVariants.PLUS_CIRCLE} marginRight={3} />
            <span>{t('menu.add')}</span>
          </Link>
        </li>
        <li>
          <Link href="/search">
            <Icon variant={IconVariants.SEARCH} marginRight={3} />
            <span>{t('menu.search')}</span>
          </Link>
        </li>
      </Stack>
      <p>{t('menu.management')}</p>
      <Stack as="ul">
        <li>
          <Link href="/manage/moderation/overview">
            <Icon variant={IconVariants.FLAG} marginRight={3} />
            <span>{t('menu.validate')}</span>
          </Link>
        </li>
        <li>
          <Link href="/manage/users/overview">
            <Icon variant={IconVariants.USER} marginRight={3} />
            <span>{t('menu.users')}</span>
          </Link>
        </li>
        <li>
          <Link href="/manage/roles/overview">
            <Icon variant={IconVariants.USERS} marginRight={3} />
            <span>{t('menu.roles')}</span>
          </Link>
        </li>
        <li>
          <Link href="/manage/labels/overview">
            <Icon variant={IconVariants.TAG} marginRight={3} />
            <span>{t('menu.labels')}</span>
          </Link>
        </li>
        <li>
          <Link href="/manage/organizations">
            <Icon variant={IconVariants.SLIDE_SHARE} marginRight={3} />
            <span>{t('menu.organizations')}</span>
          </Link>
        </li>
        <li>
          <Link href="/manage/productions">
            <Icon variant={IconVariants.LAYER_GROUP} marginRight={3} />
            <span>{t('menu.productions')}</span>
          </Link>
        </li>
      </Stack>
    </Stack>
  );
};

export { SideBar };
