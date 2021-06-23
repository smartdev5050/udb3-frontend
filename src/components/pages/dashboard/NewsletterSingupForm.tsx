import { InputWithLabel } from '@/ui/InputWithLabel';
import { Link } from '@/ui/Link';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { Title } from '@/ui/Title';

const NewsletterSignupForm = () => {
  return (
    <Stack spacing={3}>
      <Text>
        Vragen of feedback? <Link href="#">Contacteer ons</Link>
      </Text>
      <Stack backgroundColor="white" padding={3} spacing={3}>
        <Title>Praktische invoertips in je mailbox</Title>
        <Text>
          Schrijf je in op onze nieuwsbrief en ontvang praktische tips voor het
          invoeren van jouw activiteiten in de UiTdatabank!
        </Text>
        <InputWithLabel
          type="email"
          id="newletter-email"
          label="Email"
          placeholder="test@test.be"
          onInput={() => {}}
        />
      </Stack>
    </Stack>
  );
};

export { NewsletterSignupForm };
