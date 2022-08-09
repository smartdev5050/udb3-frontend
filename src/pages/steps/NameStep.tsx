import { FormEvent } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { parseSpacing } from '@/ui/Box';
import { FormElement } from '@/ui/FormElement';
import { Input } from '@/ui/Input';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';

const NameStep = ({
  field,
  control,
  onChange,
  ...props
}: {
  field: any;
  control: any;
  onChange: any;
}) => {
  const { t, i18n } = useTranslation();

  const watchedValues = useWatch({ control });

  const scope = watchedValues.scope;

  return (
    <Stack {...getStackProps(props)}>
      <Controller
        name="nameAndAgeRange"
        control={control}
        render={({ field }) => {
          return (
            <Stack spacing={2}>
              <Text fontWeight="bold">
                {t(`create.step4.name.title_${scope}`)}
              </Text>
              <FormElement
                flex={2}
                id="event-name"
                Component={
                  <Input
                    value={field.value?.name.nl}
                    placeholder={t(`create.step4.name.title_${scope}`)}
                    onChange={(event) => {
                      field.onChange({
                        ...field.value,
                        name: {
                          [i18n.language]: (event.target as HTMLInputElement)
                            .value,
                        },
                      });
                    }}
                    onBlur={(event: FormEvent<HTMLInputElement>) => {
                      field.onChange({
                        ...field.value,
                        name: {
                          [i18n.language]: (event.target as HTMLInputElement)
                            .value,
                        },
                      });
                      onChange({
                        ...field.value,
                        name: {
                          [i18n.language]: (event.target as HTMLInputElement)
                            .value,
                        },
                      });
                    }}
                  />
                }
              />
              <Text
                variant={TextVariants.MUTED}
                maxWidth={parseSpacing(9)}
                dangerouslySetInnerHTML={{
                  __html: t(`create.step4.name.tip_${scope}`),
                }}
                css={`
                  strong {
                    font-weight: bold;
                  }
                `}
              ></Text>
            </Stack>
          );
        }}
      />
    </Stack>
  );
};

export { NameStep };
