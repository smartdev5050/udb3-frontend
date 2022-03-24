import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import type { InlineProps } from '@/ui/Inline';
import { getInlineProps } from '@/ui/Inline';
import { List, ListVariants } from '@/ui/List';
import { Page } from '@/ui/Page';
import { Paragraph } from '@/ui/Paragraph';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { Title } from '@/ui/Title';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

const NumberedList = ({
  steps,
  stepTranslationPath,
  ...props
}: {
  steps: number[];
  stepTranslationPath: string;
} & InlineProps) => {
  const { t } = useTranslation();

  return (
    <List
      variant={ListVariants.ORDERED}
      paddingLeft={4}
      {...getInlineProps(props)}
    >
      {steps.map((step) => (
        <List.Item key={step}>
          <Text>
            {step}. {t(`${stepTranslationPath}${step}`)}
          </Text>
        </List.Item>
      ))}
    </List>
  );
};

NumberedList.defaultProps = {
  steps: [],
};

const Copyright = () => {
  const { t } = useTranslation();

  const questionsAndAnswers: Array<{ question: string; answer: ReactNode }> = [
    {
      question: t('copyright.questions.1.question'),
      answer: <Paragraph>{t('copyright.questions.1.answer')}</Paragraph>,
    },
    {
      question: t('copyright.questions.2.question'),
      answer: (
        <Stack spacing={3}>
          <Paragraph>{t('copyright.questions.2.answer.paragraph1')}</Paragraph>
          <Paragraph>{t('copyright.questions.2.answer.paragraph2')}</Paragraph>
          <NumberedList
            steps={[1, 2, 3, 4, 5, 6]}
            stepTranslationPath="copyright.questions.2.answer.step"
          />
          <Paragraph>{t('copyright.questions.2.answer.paragraph3')}</Paragraph>
        </Stack>
      ),
    },
    {
      question: t('copyright.questions.3.question'),
      answer: <Paragraph>{t('copyright.questions.3.answer')}</Paragraph>,
    },
    {
      question: t('copyright.questions.4.question'),
      answer: (
        <Stack spacing={3}>
          <Paragraph>{t('copyright.questions.4.answer.paragraph1')}</Paragraph>
          <NumberedList
            steps={[1, 2, 3, 4, 5, 6]}
            stepTranslationPath="copyright.questions.4.answer.step"
          />
        </Stack>
      ),
    },
    {
      question: t('copyright.questions.5.question'),
      answer: <Paragraph>{t('copyright.questions.5.answer')}</Paragraph>,
    },
    {
      question: t('copyright.questions.6.question'),
      answer: <Paragraph>{t('copyright.questions.6.answer')}</Paragraph>,
    },
    {
      question: t('copyright.questions.7.question'),
      answer: <Paragraph>{t('copyright.questions.7.answer')}</Paragraph>,
    },
  ];

  return (
    <Page>
      <Page.Title>Copyright</Page.Title>
      <Page.Content spacing={5}>
        {questionsAndAnswers.map(({ question, answer }) => (
          <Stack key={question} spacing={3}>
            <Title size={2}>{question}</Title>
            {answer}
          </Stack>
        ))}
      </Page.Content>
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export default Copyright;
