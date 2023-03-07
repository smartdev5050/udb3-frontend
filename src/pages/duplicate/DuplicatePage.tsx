import { Alert, AlertVariants } from '@/ui/Alert';
import { Inline } from '@/ui/Inline';
import { Page } from '@/ui/Page';
import { Stack } from '@/ui/Stack';

import { CalendarStep } from '../steps/CalendarStep';

const DuplicatePage = () => {
  return (
    <Page>
      <Page.Title>Kopiëren en aanpassen</Page.Title>
      <Page.Content>
        <Alert variant={AlertVariants.PRIMARY}>
          Je staat op het punt een evenement te kopiëren. Kies een tijdstip voor
          dit evenement.
        </Alert>
        <CalendarStep />
      </Page.Content>
    </Page>
  );
};

export { DuplicatePage };
