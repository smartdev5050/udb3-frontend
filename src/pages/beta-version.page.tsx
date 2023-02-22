import { Router, useRouter } from 'next/router';
import { useEffect } from 'react';

import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import { FeatureFlags, useFeatureFlag } from '@/hooks/useFeatureFlag';
import { parseSpacing } from '@/ui/Box';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Page } from '@/ui/Page';
import { Paragraph } from '@/ui/Paragraph';
import { Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { ToggleBox } from '@/ui/ToggleBox';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

const BetaVersionPage = () => {
  const { setCookie } = useCookiesWithOptions([
    'has_seen_beta_conversion_page',
  ]);

  useEffect(() => {
    setCookie('has_seen_beta_conversion_page', 'true');
  }, [setCookie]);

  const { push } = useRouter();

  const goToCreatePage = () => push('/event');

  const [_, setIsNewCreateEnabled] = useFeatureFlag(FeatureFlags.REACT_CREATE);

  const handleConfirmation = () => {
    setIsNewCreateEnabled(true);

    goToCreatePage();
  };

  return (
    <Page>
      <Page.Title>Wil jij de beta-versie van UiTdatabank proberen?</Page.Title>
      <Page.Content spacing={5}>
        <Stack spacing={4} fontSize="1.1rem">
          <Paragraph>
            Wij zijn altijd druk bezig met de ontwikkeling van UiTdatabank. Met
            de beta-versie van UiTdatabank kan jij genieten van de nieuwste
            features en een verbeterde gebruikersinterface.
          </Paragraph>
          <Paragraph>
            Ben je geïnteresseerd om een van de eersten te zijn die onze nieuwe
            features gebruikt? Klik dan op {'"Probeer nu"'}. Je kan steeds terug
            naar de normale UI via de toggle in de menubar.
          </Paragraph>
        </Stack>
        <Inline spacing={5} alignItems="center" maxWidth="40rem">
          <ToggleBox
            onClick={goToCreatePage}
            // active={isOneOrMoreDays}
            // icon={<IconOneOrMoreDays />}
            icon={
              <Icon name={Icons.TIMES} color="red" width={36} height={36} />
            }
            minHeight={parseSpacing(7)}
            flex={1}
          >
            <Text fontWeight="bold">Liever niet</Text>
            <Text variant={TextVariants.MUTED}>
              Ga verder {<Text fontWeight="bold">zonder</Text>} de nieuwe UI
            </Text>
          </ToggleBox>
          <ToggleBox
            onClick={handleConfirmation}
            // active={isFixedDays}
            icon={
              <Icon name={Icons.CHECK} color="green" width={36} height={36} />
            }
            minHeight={parseSpacing(7)}
            flex={1}
            // disabled={disableChooseFixedDays}
          >
            <Text fontWeight="bold">Probeer nu</Text>
            <Text variant={TextVariants.MUTED}>
              Ga verder {<Text fontWeight="bold">met</Text>} de nieuwe UI
            </Text>
          </ToggleBox>
        </Inline>
      </Page.Content>
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export default BetaVersionPage;
