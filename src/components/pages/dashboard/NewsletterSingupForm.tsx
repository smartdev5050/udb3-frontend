import type { FormEvent } from 'react';
import { useRef, useState } from 'react';

import { Button } from '@/ui/Button';
import { Inline } from '@/ui/Inline';
import { InputWithLabel } from '@/ui/InputWithLabel';
import { Link } from '@/ui/Link';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { Title } from '@/ui/Title';

const NewsletterSignupForm = () => {
  const formRef = useRef<HTMLFormElement>();
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (email.length > 0 && !!formRef?.current?.checkValidity()) {
      // do stuff
      console.log('do stuff');
    }
  };

  return (
    <Stack spacing={5}>
      <Text>
        Vragen of feedback? <Link href="#">Contacteer ons</Link>
      </Text>
      <Stack backgroundColor="white" padding={4} spacing={4}>
        <Title>Praktische invoertips in je mailbox</Title>
        <Text>
          Schrijf je in op onze nieuwsbrief en ontvang praktische tips voor het
          invoeren van jouw activiteiten in de UiTdatabank!
        </Text>
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
              setEmail(e.target.value);
            }}
            value={email}
          />
          <Button onClick={handleSubmit}>Inschrijven</Button>
        </Inline>
      </Stack>
    </Stack>
  );
};

export { NewsletterSignupForm };
