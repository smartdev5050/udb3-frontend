import PropTypes from 'prop-types';
import { getStackProps, Stack, stackPropTypes } from '../../publiq-ui/Stack';
import { Title } from '../../publiq-ui/Title';
import { List } from '../../publiq-ui/List';
import { useTranslation } from 'react-i18next';
import { getValueFromTheme } from '../../publiq-ui/theme';
import { Panel } from '../../publiq-ui/Panel';

const getValue = getValueFromTheme('productionItem');

const Productions = ({
  productions,
  onClickProduction,
  className,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <Stack className={className} spacing={4} {...getStackProps(props)}>
      <Title>{t('productions.overview.production')}</Title>
      <Panel>
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
              key={production.production_id}
              onClick={() => onClickProduction(production.production_id)}
            >
              {production.name}
            </List.Item>
          ))}
        </List>
      </Panel>
    </Stack>
  );
};

Productions.propTypes = {
  ...stackPropTypes,
  productions: PropTypes.array,
  onClickProduction: PropTypes.func,
  className: PropTypes.string,
};

Productions.defaultProps = {
  productions: [],
};

export { Productions };
