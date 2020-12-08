import { useTranslation } from 'react-i18next';
import { Page } from '../../../components/publiq-ui/Page';
import { InputWithLabel } from '../../../components/publiq-ui/InputWithLabel';
import { Inline } from '../../../components/publiq-ui/Inline';
import { Productions } from '../../../components/productions/index/Productions';
import { useGetProductions } from '../../../hooks/api/productions';
import { Events } from '../../../components/productions/index/Events';
import { parseSpacing } from '../../../components/publiq-ui/Box';
import { useEffect, useState } from 'react';

const Index = () => {
  const { t } = useTranslation();
  const { data: productionsData } = useGetProductions(15);
  const rawProductions = productionsData?.member ?? [];
  const events = [];

  const [productions, setProductions] = useState([]);
  const [activeProductionsid, setActiveProductionsId] = useState('');

  useEffect(() => {
    if (rawProductions.length === 0) {
      return;
    }

    setProductions(
      rawProductions.map((production, index) => {
        if (index === 0) {
          return { ...production, active: true };
        }
        return { ...production, active: false };
      }),
    );
  }, [rawProductions]);

  useEffect(() => {
    setProductions((prevProductions) =>
      prevProductions.map((production) => {
        if (production.active) {
          return { ...production, active: false };
        }
        if (production.production_id === activeProductionsid) {
          return { ...production, active: true };
        }
        return production;
      }),
    );
  }, [activeProductionsid]);

  const handleClickProduction = (id) => {
    setActiveProductionsId(id);
  };

  return (
    <Page>
      <Page.Title
        actionTitle={t('productions.overview.create')}
        actionHref="/manage/productions/create"
      >
        {t('menu.productions')}
      </Page.Title>
      <Page.Actions>
        <Link
          href="/manage/productions/create"
          css="text-transform: lowercase;"
        >
          {t('productions.overview.create')}
        </Link>
      </Page.Actions>
      <Page.Content>
        <InputWithLabel
          id="productions-overview-search"
          placeholder={t('productions.overview.search.placeholder')}
          marginBottom={4}
        >
          {t('productions.overview.search.label')}
        </InputWithLabel>
        <Inline spacing={4}>
          <Productions
            width={`calc(40% - ${parseSpacing(4)()})`}
            productions={productions}
            onClickProduction={handleClickProduction}
          />
          {/* <Events
          width="60%"
          events={events}
          loading={!activeProduction}
          activeProductionName={activeProduction?.name ?? ''}
        />  */}
        </Inline>
      </Page.Content>
    </Page>
  );
};

export default Index;
