import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { getValueFromTheme } from '@/ui/theme';

const getValue = getValueFromTheme('organizeAddModal');

const schema = yup.object({
  phone: yup.string().required(),
  email: yup.string().email().required(),
  url: yup.string().url().required(),
});

type Data = yup.InferType<typeof schema>;

type Props = StackProps & {
  name: keyof Data;
  onAdd: (value: string) => void;
  addLabel: string;
};

const ContactPoint = ({ name, onAdd, addLabel, ...props }: Props) => {
  const { t } = useTranslation();

  const [isExpanded, setIsExpanded] = useState(false);

  const { reset, trigger, watch, formState, register } = useForm<Data>({
    resolver: yupResolver(schema),
  });

  const watchedValue = watch(name);

  if (!isExpanded) {
    return (
      <Button variant={ButtonVariants.LINK} onClick={() => setIsExpanded(true)}>
        {addLabel}
      </Button>
    );
  }

  return (
    <Stack
      padding={4}
      spacing={4}
      css={`
        border: 1px solid ${getValue('address.borderColor')};
      `}
      {...getStackProps(props)}
    >
      <FormElement
        Component={<Input {...register(name)} />}
        id={`organizer-contactPoint-${name}`}
        label={t(`organizer.add_modal.labels.contactPoint.${name}`)}
        error={
          formState.errors[name] &&
          t(`organizer.add_modal.validation_messages.contactPoint.${name}`)
        }
      />
      <Inline spacing={3}>
        <Button
          variant={ButtonVariants.SECONDARY}
          onClick={() => {
            reset({
              [name]: '',
            });
            setIsExpanded(false);
          }}
        >
          Annuleren
        </Button>
        <Button
          variant={ButtonVariants.PRIMARY}
          onClick={async () => {
            const isValid = await trigger(name);

            if (!isValid) return;

            onAdd(watchedValue);

            reset({
              [name]: '',
            });

            setIsExpanded(false);
          }}
        >
          Toevoegen
        </Button>
      </Inline>
    </Stack>
  );
};

export { ContactPoint };
