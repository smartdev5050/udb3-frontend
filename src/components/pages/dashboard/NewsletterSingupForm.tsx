import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { QueryStatus } from '@/hooks/api/authenticated-query';
import { useAddNewsletterSubscriber } from '@/hooks/api/newsletter';
import { Alert, AlertVariants } from '@/ui/Alert';
import { parseSpacing } from '@/ui/Box';
import { Button } from '@/ui/Button';
import { Image } from '@/ui/Image';
import { Inline } from '@/ui/Inline';
import { InputWithLabel } from '@/ui/InputWithLabel';
import { Link } from '@/ui/Link';
import { Panel } from '@/ui/Panel';
import { Paragraph } from '@/ui/Paragraph';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { Title } from '@/ui/Title';

const isEmail = (value: string) =>
  yup.string().required().email().isValidSync(value);

const NewsletterSignupForm = () => {
  const formRef = useRef<HTMLFormElement>();
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);

  const { i18n, t } = useTranslation();

  const addNewsletterSubscriberMutation = useAddNewsletterSubscriber();

  const validate = () => {
    setIsValid(isEmail(email));
  };

  const handleSubmit = () => {
    validate();

    if (isValid) {
      addNewsletterSubscriberMutation.mutate({ email });
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
          <Inline as="div" justifyContent="space-between">
            {addNewsletterSubscriberMutation.status === 'success' ? (
              <Stack spacing={4}>
                <Title>{t('dashboard.newsletter.success.title')}</Title>
                <Paragraph>
                  {t('dashboard.newsletter.success.content')}
                </Paragraph>
              </Stack>
            ) : (
              <Stack spacing={4}>
                <Title>{t('dashboard.newsletter.title')}</Title>
                <Paragraph>{t('dashboard.newsletter.content')}</Paragraph>
                <Inline
                  as="form"
                  ref={formRef}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                  alignItems="center"
                  spacing={4}
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
                    flex={1}
                    maxWidth="30rem"
                  />
                  <Button onClick={handleSubmit} maxHeight={parseSpacing(5)()}>
                    {t('dashboard.newsletter.subscribe')}
                  </Button>
                </Inline>
                {!isValid && (
                  <Alert variant={AlertVariants.DANGER}>
                    {t('dashboard.newsletter.invalid')}
                  </Alert>
                )}
              </Stack>
            )}

            <Image
              src={`/assets/${t('dashboard.newsletter.logo')}`}
              alt={t('dashboard.newsletter.logo_alt')}
              width={200}
              paddingLeft={5}
            />
          </Inline>
        </Panel>
      )}
    </Stack>
  );
};

export { NewsletterSignupForm };
