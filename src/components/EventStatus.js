import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Alert, AlertVariants } from './publiq-ui/Alert';
import { Button, ButtonVariants } from './publiq-ui/Button';
import { Page } from './publiq-ui/Page';
import { Spinner } from './publiq-ui/Spinner';

const EventStatus = ({ offer, loading, errorMessage }) => {
  const { t, i18n } = useTranslation();
  const name = offer.name?.[i18n.language] ?? offer.name?.[offer.mainLanguage];
  return (
    <Page>
      <Page.Title>{t('eventStatus.title', { name })}</Page.Title>
      <Page.Content spacing={5}>
        {loading ? (
          <Spinner marginTop={4} />
        ) : errorMessage ? (
          <Alert variant={AlertVariants.WARNING}>{errorMessage}</Alert>
        ) : (
          [
            <Alert key="alert">{t('eventStatus.info')}</Alert>,
            <Button
              key="button"
              variant={ButtonVariants.SUCCESS}
              width="max-content"
            >
              {t('eventStatus.modificationReady')}
            </Button>,
          ]
        )}
      </Page.Content>
    </Page>
  );
};

EventStatus.propTypes = {
  offer: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
};

export { EventStatus };
