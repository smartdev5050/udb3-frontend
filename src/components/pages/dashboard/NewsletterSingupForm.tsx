import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import validator from 'validator';

import { Alert, AlertVariants } from '@/ui/Alert';
import { Button } from '@/ui/Button';
import { Inline } from '@/ui/Inline';
import { InputWithLabel } from '@/ui/InputWithLabel';
import { Link } from '@/ui/Link';
import { Panel } from '@/ui/Panel';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { Title } from '@/ui/Title';

const NewsletterSignupForm = () => {
  const formRef = useRef<HTMLFormElement>();
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);

  const { i18n, t } = useTranslation();

  const validate = () => {
    if (validator.isEmpty(email) || !validator.isEmail(email)) {
      setIsValid(false);
    }
  };

  const handleSubmit = () => {
    validate();

    if (isValid) {
      console.log('Do stuff');
    }
  };

  return (
    <Stack spacing={4}>
      <Text>
        {t('dashboard.newsletter.questions_or_feedback')}{' '}
        <Link href="#">{t('dashboard.newsletter.contact')}</Link>
      </Text>
      {i18n.language === 'nl' && (
        <Panel backgroundColor="white" padding={4} spacing={4}>
          <Title>{t('dashboard.newsletter.title')}</Title>
          <Text>{t('dashboard.newsletter.content')}</Text>

          <Inline
            as="form"
            ref={formRef}
            spacing={4}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <InputWithLabel
              type="email"
              id="newletter-email"
              label="Email"
              placeholder="test@test.be"
              onInput={(e) => {
                setIsValid(true);
                setEmail(e.target.value);
              }}
              value={email}
            />
            <Button onClick={handleSubmit}>
              {t('dashboard.newsletter.subscribe')}
            </Button>
          </Inline>

          {!isValid && (
            <Alert variant={AlertVariants.DANGER}>
              {t('dashboard.newsletter.invalid')}
            </Alert>
          )}
        </Panel>
      )}
    </Stack>
  );
};

export { NewsletterSignupForm };
