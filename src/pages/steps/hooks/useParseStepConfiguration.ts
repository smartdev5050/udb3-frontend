import { yupResolver } from '@hookform/resolvers/yup';
import { DeepPartial, Path, useForm, UseFormProps } from 'react-hook-form';
import * as yup from 'yup';

import { isEmptyObject } from '@/types/EmptyObject';

import { FormDataUnion, StepsConfiguration } from '../Steps';

type Config = {
  formConfiguration?: UseFormProps<FormDataUnion>;
};

const useParseStepConfiguration = (
  configurations: Array<StepsConfiguration>,
  { formConfiguration = {} }: Config = {},
) => {
  const schema = yup
    .object(
      configurations.reduce<Record<Path<FormDataUnion>, any> | {}>(
        (acc, config) => {
          if (!config.name || !config.validation) return acc;

          return {
            ...acc,
            [config.name]: config.validation,
          };
        },
        {},
      ),
    )
    .required();

  const resolver = yupResolver(schema);

  const defaultValues = configurations.reduce<DeepPartial<FormDataUnion> | {}>(
    (acc, config) => {
      if (!config.name || !config.defaultValue) return acc;
      return {
        ...acc,
        [config.name]: config.defaultValue,
      };
    },
    {},
  );

  const form = useForm<FormDataUnion>({
    resolver,
    defaultValues: isEmptyObject(defaultValues) ? undefined : defaultValues,
    ...formConfiguration,
  });

  return { form };
};

export { useParseStepConfiguration };
