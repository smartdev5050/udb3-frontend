import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { FormDataUnion } from '../Steps';

const useParseStepConfiguration = <TFormData extends FormDataUnion>(
  configuration,
  { formConfiguration = {} } = {},
) => {
  const schema = yup
    .object(
      configuration.reduce(
        (acc: Object, val: { field: string; validation: () => void }) => {
          if (!val.field || !val.validation) return acc;

          return {
            ...acc,
            [val.field]: val.validation,
          };
        },
        {},
      ),
    )
    .required();

  const resolver = yupResolver(schema);

  const defaultValues = configuration.reduce(
    (acc: Object, val: { field: string; defaultValue: unknown }) => {
      if (!val.field || !val.defaultValue) return acc;
      return {
        ...acc,
        [val.field]: val.defaultValue,
      };
    },
    {},
  );

  const form = useForm<TFormData>({
    resolver,
    defaultValues,
    ...formConfiguration,
  });

  return { form };
};

export { useParseStepConfiguration };
