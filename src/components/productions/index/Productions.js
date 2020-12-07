import PropTypes from 'prop-types';
import { getStackProps, Stack, stackPropTypes } from '../../publiq-ui/Stack';
import { Title } from '../../publiq-ui/Title';
import { List } from '../../publiq-ui/List';
import { useTranslation } from 'react-i18next';

const Productions = ({
  productions,
  onClickProduction,
  className,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <Stack className={className} {...getStackProps(props)}>
      <Title>{t('productions.overview.production')}</Title>
      <List>
        {productions.map((production) => (
          <List.Item
            paddingLeft={4}
            paddingRight={4}
            paddingBottom={3}
            paddingTop={3}
            color={production.active && 'white'}
            backgroundColor={production.active ? 'red' : 'white'}
            cursor="pointer"
            key={production.production_id}
            onClick={() => onClickProduction(production.production_id)}
          >
            {production.name}
          </List.Item>
        ))}
      </List>
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
