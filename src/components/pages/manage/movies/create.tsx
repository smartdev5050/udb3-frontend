import { useMachine } from '@xstate/react';
import { MovieEventTypes, movieMachine } from 'machines/movie';
import { useTranslation } from 'react-i18next';

import { MovieThemes } from '@/constants/MovieThemes';
import type { Values } from '@/types/Values';
import { Badge, BadgeVariants } from '@/ui/Badge';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Page } from '@/ui/Page';
import { Text } from '@/ui/Text';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

const Step1Content = () => {
  const [current, send] = useMachine(movieMachine);

  const { t } = useTranslation();

  const handleSelectTheme = (value: Values<typeof MovieThemes>) => {
    send(MovieEventTypes.CHOOSE_THEME, { value });
  };
  const handleClearTheme = () => send(MovieEventTypes.CLEAR_THEME);

  return (
    <Inline spacing={3} flexWrap="wrap" maxWidth="70rem">
      {current.context.theme === null ? (
        Object.entries(MovieThemes).map(([key, value]) => (
          <Button
            width="auto"
            marginBottom={3}
            display="inline-flex"
            key={key}
            variant={ButtonVariants.SECONDARY}
            onClick={() => handleSelectTheme(value)}
          >
            {key}
          </Button>
        ))
      ) : (
        <Inline alignItems="center" spacing={3}>
          <Icon name={Icons.CHECK_CIRCLE} color="green" />
          <Text>
            {t(`themes*${current.context.theme}`, { keySeparator: '*' })}
          </Text>
          <Button variant={ButtonVariants.PRIMARY} onClick={handleClearTheme}>
            Wijzig thema
          </Button>
        </Inline>
      )}
    </Inline>
  );
};

const Create = () => {
  const { t } = useTranslation();

  const steps = [{ step: 1, Content: <Step1Content /> }];

  return (
    <Page>
      {steps.map(({ Content, step }) => {
        return [
          <Page.Title key="title" spacing={4} alignItems="center">
            <Badge
              variant={BadgeVariants.SECONDARY}
              borderRadius="50%"
              width="2rem"
              height="2rem"
              lineHeight="2rem"
              padding={0}
            >
              {step}
            </Badge>
            <Text>{t(`movies.create.step${step}_title`)}</Text>
          </Page.Title>,
          <Page.Content key="content">{Content}</Page.Content>,
        ];
      })}
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export default Create;
