import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { List } from '../../publiq-ui/List';
import { getStackProps, Stack, stackPropTypes } from '../../publiq-ui/Stack';
import { Title } from '../../publiq-ui/Title';
import { CheckboxWithLabel } from '../../publiq-ui/CheckboxWithLabel';
import { Button, ButtonVariants } from '../../publiq-ui/Button';
import { Icon, Icons } from '../../publiq-ui/Icon';
import { useState } from 'react';
import { getValueFromTheme } from '../../publiq-ui/theme';
import { Panel } from '../../publiq-ui/Panel';
import { Inline } from '../../publiq-ui/Inline';
import { useGetCalendarSummary } from '../../../hooks/api/events';
import { Spinner } from '../../publiq-ui/Spinner';
import { Input } from '../../publiq-ui/Input';
import { DetailTable } from '../../publiq-ui/DetailTable';
import { parseSpacing } from '../../publiq-ui/Box';

const getValue = getValueFromTheme('eventItem');

const getEventType = (terms) => {
  const foundTerm = terms.find((term) => term.domain === 'eventtype') || {};
  return foundTerm.label ? foundTerm.label : '';
};

const Event = ({
  id,
  name,
  type,
  location,
  calendarType,
  onToggle,
  selected,
  className,
}) => {
  const { i18n, t } = useTranslation();
  const { data: period } = useGetCalendarSummary({
    id,
    locale: i18n?.language ?? '',
    format: calendarType === 'single' ? 'lg' : 'sm',
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleClickToggleExpand = () => {
    setIsExpanded((prevValue) => !prevValue);
  };

  return (
    <List.Item
      key={id}
      paddingLeft={4}
      paddingRight={4}
      paddingBottom={3}
      paddingTop={3}
      backgroundColor="white"
      className={className}
    >
      <Stack as="div" flex={1} spacing={3}>
        <Inline as="div" justifyContent="space-between">
          <CheckboxWithLabel
            id={id}
            name={name}
            onToggle={() => onToggle(id)}
            checked={selected}
          >
            {name}
          </CheckboxWithLabel>
          <Button
            onClick={handleClickToggleExpand}
            variant={ButtonVariants.UNSTYLED}
          >
            <Icon
              name={isExpanded ? Icons.CHEVRON_DOWN : Icons.CHEVRON_RIGHT}
            />
          </Button>
        </Inline>
        {isExpanded && (
          <DetailTable
            items={[
              { header: t('productions.event.type'), value: type },
              { header: t('productions.event.when'), value: period },
              { header: t('productions.event.where'), value: location },
            ]}
          />
        )}
      </Stack>
    </List.Item>
  );
};

Event.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  location: PropTypes.string,
  calendarType: PropTypes.string,
  onToggle: PropTypes.func,
  selected: PropTypes.bool,
  className: PropTypes.string,
};

const DefaultMenu = ({
  activeProductionName,
  onAdd,
  onDelete,
  shouldDisableDeleteButton,
}) => {
  const { t } = useTranslation();

  return (
    <Inline as="div" justifyContent="space-between" alignItems="center">
      <Title>
        {t('productions.overview.events_in_production', {
          productionName: activeProductionName,
        })}
      </Title>
      <Inline as="div" spacing={3}>
        <Button
          iconName={Icons.PLUS}
          spacing={3}
          maxHeight={parseSpacing(5)()}
          onClick={onAdd}
        >
          {t('productions.overview.create')}
        </Button>
        <Button
          disabled={shouldDisableDeleteButton}
          variant={ButtonVariants.DANGER}
          iconName={Icons.TRASH}
          spacing={3}
          onClick={onDelete}
          maxHeight={parseSpacing(5)()}
        >
          {t('productions.overview.delete')}
        </Button>
      </Inline>
    </Inline>
  );
};

DefaultMenu.propTypes = {
  activeProductionName: PropTypes.string,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  shouldDisableDeleteButton: PropTypes.bool,
};

const AddMenu = ({ onAdd, onCancel }) => {
  const { t } = useTranslation();
  const [toBeAddedId, setToBeAddedId] = useState('');

  return (
    <Inline as="div" spacing={3} alignItems="center">
      <Input
        id="cdbid"
        placeholder="cdbid"
        maxWidth="22rem"
        onInput={(e) => {
          setToBeAddedId(e.target.value.toString().trim());
        }}
      />
      <Button
        iconName={Icons.CHECK}
        spacing={3}
        onClick={() => onAdd(toBeAddedId)}
      >
        {t('productions.overview.confirm')}
      </Button>
      <Button
        variant={ButtonVariants.SECONDARY}
        iconName={Icons.TIMES}
        spacing={3}
        onClick={onCancel}
      >
        {t('productions.overview.cancel')}
      </Button>
    </Inline>
  );
};

AddMenu.propTypes = {
  onAdd: PropTypes.func,
  onCancel: PropTypes.func,
};

const Events = ({
  events,
  activeProductionName,
  loading,
  onToggleEvent,
  onDeleteEvents,
  onAddEvent,
  shouldDisableDeleteButton,
  className,
  ...props
}) => {
  const { i18n } = useTranslation();
  const [isAddMenuVisible, setIsAddMenuVisible] = useState(false);

  return (
    <Stack spacing={4} {...getStackProps(props)}>
      {loading ? (
        <Spinner marginTop={4} />
      ) : (
        [
          <Stack key="title-and-buttons" spacing={3}>
            {isAddMenuVisible ? (
              <AddMenu
                onAdd={onAddEvent}
                onCancel={() => {
                  setIsAddMenuVisible(false);
                }}
              />
            ) : (
              <DefaultMenu
                onAdd={() => {
                  setIsAddMenuVisible(true);
                }}
                onDelete={() => onDeleteEvents()}
                shouldDisableDeleteButton={shouldDisableDeleteButton}
              />
            )}
          </Stack>,
          <Panel key="panel">
            <List>
              {events.map((event, index) => (
                <Event
                  key={event.id}
                  id={event.id}
                  name={event.name[i18n.language]}
                  type={getEventType(event.terms)}
                  location={event.location.name[i18n.language]}
                  calendarType={event.calendarType}
                  onToggle={onToggleEvent}
                  selected={event.selected}
                  css={
                    index !== events.length - 1
                      ? (props) => {
                          return `border-bottom: 1px solid ${getValue(
                            'borderColor',
                          )(props)};`;
                        }
                      : undefined
                  }
                />
              ))}
            </List>
          </Panel>,
        ]
      )}
    </Stack>
  );
};

Events.propTypes = {
  ...stackPropTypes,
  events: PropTypes.array,
  activeProductionName: PropTypes.string,
  loading: PropTypes.bool,
  onToggleEvent: PropTypes.func,
  selectedIds: PropTypes.array,
  onDeleteEvents: PropTypes.func,
  onAddEvent: PropTypes.func,
  shouldDisableDeleteButton: PropTypes.bool,
  className: PropTypes.string,
};

Events.defaultProps = {
  events: [],
  loading: false,
};

export { Events };
