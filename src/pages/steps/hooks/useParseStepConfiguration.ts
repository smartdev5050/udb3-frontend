import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { FormData } from './MovieForm';

const useParseStepConfiguration = (
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

  const form = useForm<FormData>({
    resolver,
    defaultValues,
    ...formConfiguration,
  });

  return { form };
};

export { useParseStepConfiguration };
