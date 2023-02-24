import { Router, useRouter } from 'next/router';
import { useEffect } from 'react';

import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import { FeatureFlags, useFeatureFlag } from '@/hooks/useFeatureFlag';
import { parseSpacing } from '@/ui/Box';
import { Card } from '@/ui/Card';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { List } from '@/ui/List';
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
              Wil jij de vernieuwde versie van UiTdatabank proberen?
            </Title>
            <Stack spacing={5} fontSize="1.1rem">
              <Paragraph>
                Met de beta-versie van UiTdatabank kan je meteen genieten van
                een verbeterde interface.
              </Paragraph>
              <Text fontWeight="bold">
                Wat kan je verwachten in deze versie?
              </Text>
              <List>
                <List.Item>
                  <Text fontWeight="bold">Nieuwe mogelijkheden:</Text>
                  <Text>
                    toevoegen van online evenementen, video bij je evenement,
                    etc.
                  </Text>
                </List.Item>
                <List.Item>
                  <Text fontWeight="bold">Verbeterde gebruikservaring:</Text>
                  <Text>
                    we zetten informatie die je eerder al invoerde klaar voor
                    jou zodat je met minder klikken door het invoerformulier kan
                  </Text>
                </List.Item>
                <List.Item>
                  <Text fontWeight="bold">Onmiddellijke feedback</Text>
                  <Text>
                    over de volledigheid van je ingevoerd evenement of locatie
                  </Text>
                </List.Item>
              </List>
              <Paragraph>
                Dat is nog maar het begin. De komende maanden zal deze interface
                nog verder uitgebreid en verbeterd worden.
              </Paragraph>
              <Paragraph>
                Wil je als een van de eersten de nieuwe interface gebruiken?
              </Paragraph>
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
                  <Text fontWeight="bold">Ik probeer het UiT</Text>
                  <Text variant={TextVariants.MUTED}>
                    Ga verder {<Text fontWeight="bold">met</Text>} de nieuwe
                    interface
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
                  <Text fontWeight="bold">Ik wacht nog even</Text>
                  <Text variant={TextVariants.MUTED}>
                    Je kan op een later moment de overstap maken
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
