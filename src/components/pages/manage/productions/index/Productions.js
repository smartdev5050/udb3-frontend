import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { parseSpacing } from '@/ui/Box';
import { List } from '@/ui/List';
import { Pagination } from '@/ui/Pagination';
import { Panel } from '@/ui/Panel';
import { Spinner } from '@/ui/Spinner';
import { getStackProps, Stack } from '@/ui/Stack';
import { getValueFromTheme } from '@/ui/theme';
import { Title } from '@/ui/Title';

const getValue = getValueFromTheme('productionItem');

const Productions = ({
  productions,
  currentPage,
  totalItems,
  perPage,
  onClickProduction,
  onChangePage,
  className,
  loading,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <Stack className={className} spacing={4} {...getStackProps(props)}>
      {loading ? (
        <Spinner marginTop={4} />
      ) : (
        [
          <Title key="title" minHeight={parseSpacing(5)()}>
            {t('productions.overview.production')}
          </Title>,
          <Panel key="panel">
            <List>
              {productions.map((production, index) => (
                <List.Item
                  paddingLeft={4}
                  paddingRight={4}
                  paddingBottom={3}
                  paddingTop={3}
                  color={production.active && getValue('activeColor')}
                  backgroundColor={
                    production.active
                      ? getValue('activeBackgroundColor')
                      : getValue('backgroundColor')
                  }
                  cursor="pointer"
                  css={
                    index !== productions.length - 1
                      ? (props) => {
                          return `border-bottom: 1px solid ${getValue(
                            'borderColor',
                          )(props)};`;
                        }
                      : undefined
                  }
                  key={production.id}
                  onClick={() => onClickProduction(production.id)}
                >
                  {production.name}
                </List.Item>
              ))}
            </List>
            <Panel.Footer>
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                perPage={perPage}
                prevText={t('pagination.previous')}
                nextText={t('pagination.next')}
                onChangePage={onChangePage}
              />
            </Panel.Footer>
          </Panel>,
        ]
      )}
    </Stack>
  );
};

Productions.propTypes = {
  productions: PropTypes.array,
  currentPage: PropTypes.number,
  totalItems: PropTypes.number,
  perPage: PropTypes.number,
  onClickProduction: PropTypes.func,
  onChangePage: PropTypes.func,
  className: PropTypes.string,
  loading: PropTypes.bool,
};

Productions.defaultProps = {
  productions: [],
  loading: false,
};

export { Productions };
