import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import { FeatureFlags, useFeatureFlag } from '@/hooks/useFeatureFlag';
import { parseSpacing } from '@/ui/Box';
import { Card } from '@/ui/Card';
import { Image } from '@/ui/Image';
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
  const { t } = useTranslation();

  const { setCookie } = useCookiesWithOptions([
    'has_seen_beta_conversion_page',
  ]);

  useEffect(() => {
    setCookie('has_seen_beta_conversion_page', 'true');
  }, [setCookie]);

  const goToCreatePage = () => {
    // I can't seem to use router.push successfully here
    document.location.href = '/event';
  };

  const [_, setIsNewCreateEnabled] = useFeatureFlag(FeatureFlags.REACT_CREATE);

  const handleConfirmation = () => {
    setIsNewCreateEnabled(true);

    goToCreatePage();
  };

  const handleCancelation = () => {
    setIsNewCreateEnabled(false);

    goToCreatePage();
  };

  return (
    <Page>
      <Page.Content flex={1} alignItems="center" paddingTop={4}>
        <Card
          minWidth="40rem"
          maxWidth="75%"
          css={`
            box-shadow: ${({ theme }) => theme.components.card.boxShadow.large};
          `}
          borderRadius={getGlobalBorderRadius}
          alignItems="center"
        >
          <Stack spacing={4} paddingY={5} paddingX={6}>
            <Title
              size={1}
              css={`
                & {
                  font-weight: 700;
                }
              `}
            >
              {t('beta_version.title')}
            </Title>
            <Stack spacing={5} fontSize="1.1rem">
              <Paragraph maxWidth="initial">
                {t('beta_version.intro1')}
              </Paragraph>
              <Text fontWeight="bold">{t('beta_version.intro2')}</Text>
              <List
                css={css`
                  list-style: disc;
                `}
                paddingLeft={5}
              >
                {Array.from({ length: 3 }).map((_, index) => (
                  <List.Item
                    css={css`
                      display: list-item;
                    `}
                    key={t(`beta_version.improvements.${index}.text`)}
                  >
                    <Text>
                      <Text fontWeight="bold">
                        {t(`beta_version.improvements.${index}.prefix`)}
                      </Text>
                      <Text> </Text>
                      <Text>
                        {t(`beta_version.improvements.${index}.text`)}
                      </Text>
                    </Text>
                  </List.Item>
                ))}
              </List>
              <Paragraph maxWidth="initial">
                {t('beta_version.outro1')}
              </Paragraph>
              <Stack spacing={5}>
                <Paragraph maxWidth="initial">
                  {t('beta_version.outro2')}
                </Paragraph>
                <Inline
                  spacing={5}
                  alignItems="flex-start"
                  maxWidth="50rem"
                  alignSelf="center"
                >
                  <ToggleBox
                    onClick={handleConfirmation}
                    minHeight={parseSpacing(7)}
                    flex={1}
                    height="100%"
                    icon={
                      <Image
                        src="/assets/rocket.gif"
                        width={70}
                        alt="a rocket"
                      />
                    }
                  >
                    <Text fontWeight="bold">
                      {t('beta_version.confirm.title')}
                    </Text>

                    <Text variant={TextVariants.MUTED}>
                      <Trans
                        i18nKey={'beta_version.confirm.info'}
                        components={{
                          boldText: <Text fontWeight="bold" />,
                        }}
                      />
                    </Text>
                  </ToggleBox>
                  <ToggleBox
                    onClick={handleCancelation}
                    minHeight={parseSpacing(7)}
                    flex={1}
                    icon={
                      <Image src="/assets/alarm.gif" width={70} alt="a clock" />
                    }
                  >
                    <Text fontWeight="bold">
                      {t('beta_version.cancel.title')}
                    </Text>
                    <Text variant={TextVariants.MUTED}>
                      {t('beta_version.cancel.info')}
                    </Text>
                  </ToggleBox>
                </Inline>
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Page.Content>
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export default BetaVersionPage;
