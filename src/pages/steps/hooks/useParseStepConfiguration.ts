import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { FormDataUnion } from '../Steps';

const useParseStepConfiguration = <TFormData extends FormDataUnion>(
  configurations,
  { formConfiguration = {} } = {},
) => {
  const schema = yup
    .object(
      configurations.reduce(
        (acc: Object, val: { name: string; validation: () => void }) => {
          if (!val.name || !val.validation) return acc;

          return {
            ...acc,
            [val.name]: val.validation,
          };
        },
        {},
      ),
    )
    .required();

  const resolver = yupResolver(schema);

  const defaultValues = configurations.reduce(
    (acc: Object, val: { name: string; defaultValue: unknown }) => {
      if (!val.name || !val.defaultValue) return acc;
      return {
        ...acc,
        [val.name]: val.defaultValue,
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
