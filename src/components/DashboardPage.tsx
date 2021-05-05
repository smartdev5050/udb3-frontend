import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import type { User } from '@/types/User';
import { List } from '@/ui/List';
import { Page } from '@/ui/Page';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';

type Props = { activeTab: 'events' | 'places' | 'organizers' };

const DashboardPage = ({ activeTab }: Props) => {
  const { cookies } = useCookiesWithOptions(['user']);

  const user: User = cookies.user;

  return (
    <Page>
      <Page.Title>Welkom {user?.username}</Page.Title>
      <Page.Content spacing={5}>
        <Stack spacing={3}>
          <Text>Mijn activiteiten en locaties</Text>
          <List>
            <List.Item>
              <Text>Test</Text>
            </List.Item>
          </List>
        </Stack>
      </Page.Content>
    </Page>
  );
};

export { DashboardPage };
