import { Inline } from '@/ui/Inline';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text } from '@/ui/Text';

type Props = StackProps;

const Audience = ({ ...props }: Props) => {
  return (
    <Stack {...getStackProps(props)}>
      <Inline spacing={3} marginBottom={3}>
        <Text fontWeight="bold">Toegang</Text>
      </Inline>
    </Stack>
  );
};
export { Audience };
