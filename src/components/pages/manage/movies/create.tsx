import { useTranslation } from 'react-i18next';

import { Badge, BadgeVariants } from '@/ui/Badge';
import { Page } from '@/ui/Page';
import { Text } from '@/ui/Text';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

const Create = () => {
  const { t } = useTranslation();

  const steps = new Array(4).fill(null);

  return (
    <Page>
      {steps.map((_step, index) => {
        return (
          <Page.Title key={index} spacing={4} alignItems="center">
            <Badge
              variant={BadgeVariants.SECONDARY}
              borderRadius="50%"
              width="2rem"
              height="2rem"
              lineHeight="2rem"
              padding={0}
            >
              {index + 1}
            </Badge>
            <Text>{t(`movies.create.step${index + 1}_title`)}</Text>
          </Page.Title>
        );
      })}
      <Page.Content />
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export default Create;
