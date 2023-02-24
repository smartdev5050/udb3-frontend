import { Router, useRouter } from 'next/router';
import { useEffect } from 'react';

import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import { FeatureFlags, useFeatureFlag } from '@/hooks/useFeatureFlag';
import { parseSpacing } from '@/ui/Box';
import { Card } from '@/ui/Card';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Page } from '@/ui/Page';
import { Paragraph } from '@/ui/Paragraph';
import { Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { getGlobalBorderRadius } from '@/ui/theme';
import { Title } from '@/ui/Title';
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
      <Page.Content alignItems="center" justifyContent="center" flex={1}>
        <Card
          paddingTop={5}
          paddingBottom={6}
          minWidth="60rem"
          css={`
            box-shadow: ${({ theme }) =>
              theme.components.button.boxShadow.large};
          `}
          borderRadius={getGlobalBorderRadius}
          alignItems="center"
        >
          <Stack spacing={5}>
            <Title
              size={1}
              css={`
                & {
                  font-weight: 700;
                }
              `}
            >
              Wil jij de beta-versie van UiTdatabank proberen?
            </Title>
            <Stack spacing={5}>
              <Stack spacing={4} fontSize="1.1rem">
                <Paragraph>
                  Wij zijn altijd druk bezig met de ontwikkeling van
                  UiTdatabank. Met de beta-versie van UiTdatabank kan jij
                  genieten van de nieuwste features en een verbeterde
                  gebruikersinterface.
                </Paragraph>
                <Paragraph>
                  Ben je geïnteresseerd om een van de eersten te zijn die onze
                  nieuwe features gebruikt? Klik dan op {'"Probeer nu"'}. Je kan
                  steeds terug naar de normale UI via de toggle in de menubar.
                </Paragraph>
              </Stack>
              <Inline spacing={5} alignItems="center" maxWidth="50rem">
                <ToggleBox
                  onClick={handleConfirmation}
                  icon={
                    <Icon
                      name={Icons.CHECK}
                      color="green"
                      width={36}
                      height={36}
                    />
                  }
                  minHeight={parseSpacing(7)}
                  flex={1}
                >
                  <Text fontWeight="bold">Probeer nu</Text>
                  <Text variant={TextVariants.MUTED}>
                    Ga verder {<Text fontWeight="bold">met</Text>} de nieuwe UI
                  </Text>
                </ToggleBox>
                <ToggleBox
                  onClick={goToCreatePage}
                  icon={
                    <Icon
                      name={Icons.QUESTION}
                      color="grey"
                      width={36}
                      height={36}
                    />
                  }
                  minHeight={parseSpacing(7)}
                  flex={1}
                >
                  <Text fontWeight="bold">Misschien later</Text>
                  <Text variant={TextVariants.MUTED}>
                    Ga verder {<Text fontWeight="bold">zonder</Text>} de nieuwe
                    UI
                  </Text>
                </ToggleBox>
              </Inline>
            </Stack>
          </Stack>
        </Card>
      </Page.Content>
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export default BetaVersionPage;
