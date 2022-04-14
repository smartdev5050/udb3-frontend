import { useTranslation } from 'react-i18next';

import { Button, ButtonVariants } from '@/ui/Button';
import { Inline } from '@/ui/Inline';
import { Select } from '@/ui/Select';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';

const ContactInfoType = {
  PHONE: 'phone',
  EMAIL: 'email',
  URL: 'url',
} as const;

type Props = {};

const ContactInfo = ({}: Props) => {
  const { t } = useTranslation();

  return (
    <Stack>
      <Inline spacing={3} marginBottom={3}>
        <Text fontWeight="bold">
          {t('create.additionalInformation.contact_info.title')}
        </Text>
        <Button
          onClick={() => console.log('add price info')}
          variant={ButtonVariants.SECONDARY}
        >
          Contactinformatie toevoegen
        </Button>
      </Inline>
      <Stack>
        <Text>Price Info</Text>
        <Select>
          {Object.keys(ContactInfoType).map((key, index) => (
            <option key={index} value={ContactInfoType[key]}>
              {t(
                `create.additionalInformation.contact_info.${ContactInfoType[key]}`,
              )}
            </option>
          ))}
        </Select>
      </Stack>
    </Stack>
  );
};
export { ContactInfo };
