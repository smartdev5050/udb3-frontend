import { useTranslation } from 'react-i18next';
import { Page } from '../../../components/publiq-ui/Page';
import { InputWithLabel } from '../../../components/publiq-ui/InputWithLabel';

const Index = () => {
  const { t } = useTranslation();
  return (
    <Page>
      <Page.Title
        actionTitle={t('productions.overview.create')}
        actionHref="/manage/productions/create"
      >
        {t('menu.productions')}
      </Page.Title>
      <InputWithLabel
        id="productions-overview-search"
        placeholder={t('productions.overview.search.placeholder')}
      >
        {t('productions.overview.search.label')}
      </InputWithLabel>
    </Page>
  );
};

export default Index;
