import { Path, UseFormRegister, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { Stack } from '@/ui/Stack';

import { getValue, OrganizerData } from './OrganizerAddModal';

type Props = {
  isExpanded: boolean;
  name: Path<OrganizerData>;
  addLabel: string;
  onAdd: any;
  onCancel: () => void;
  onExpand: () => void;
} & Pick<UseFormReturn<OrganizerData>, 'formState' | 'register'>;

export const ContactPoint = ({
  isExpanded,
  name,
  register,
  formState,
  addLabel,
  onAdd,
  onCancel,
  onExpand,
}: Props) => {
  const { t } = useTranslation();

  return !isExpanded ? (
    <Button variant={ButtonVariants.LINK} onClick={onExpand}>
      {addLabel}
    </Button>
  ) : (
    <Stack
      padding={4}
      spacing={4}
      css={`
        border: 1px solid ${getValue('address.borderColor')};
      `}
    >
      <FormElement
        Component={<Input {...register(name)} />}
        id={`organizer-${name}`}
        label={t(`organizer.add_modal.labels.${name}`)}
        error={
          formState.errors[name] &&
          t(`organizer.add_modal.validation_messages.${name}`)
        }
      />
      <Inline spacing={3}>
        <Button variant={ButtonVariants.SECONDARY} onClick={onCancel}>
          Annuleren
        </Button>
        <Button variant={ButtonVariants.PRIMARY} onClick={onAdd}>
          Toevoegen
        </Button>
      </Inline>
    </Stack>
  );
};
ContactPoint.defaultProps = {
  isExpanded: false,
};
