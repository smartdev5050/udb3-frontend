import { FormElement } from '@/ui/FormElement';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { Typeahead } from '@/ui/Typeahead';
import { useTranslation } from 'react-i18next';

function LabelsStep(props) {
  const { t, i18n } = useTranslation();
  return (
    <Stack>
      <FormElement
        id={'labels'}
        label={'Verfijn met labels'}
        Component={<Typeahead options={[]} labelKey={'name'} />}
        maxWidth={'50%'}
        info={
          <Text variant={TextVariants.MUTED}>
            Met labels voeg je korte, specifieke trefwoorden toe
          </Text>
        }
        {...getStackProps(props)}
      />
    </Stack>
  );
}

export { LabelsStep };
