import { yupResolver } from '@hookform/resolvers/yup';
import type { FormState, UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import type { Place } from '@/types/Place';
import type { Production } from '@/types/Production';
import { Button } from '@/ui/Button';
import { Page } from '@/ui/Page';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Step4 } from './Step4';

const schema = yup
  .object({
    theme: yup.string().required(),
    timeTable: yup
      .array()
      .test('has-timeslot', (value) =>
        value.some((rows) => rows.some((cell) => !!cell)),
      )
      .required(),
    cinema: yup
      .array()
      .test('selected-cinema', (value) => !!value?.length)
      .required(),
    production: yup
      .array()
      .test('selected-production', (value) => !!value?.length)
      .required(),
  })
  .required();

type Time = string;

type NewProduction = {
  id: string;
  name: string;
  customOption: boolean;
};

type FormData = {
  theme: string;
  timeTable: Time[][];
  cinema: Place[];
  production: Array<Production | NewProduction>;
};

type StepProps = Pick<
  UseFormReturn<FormData>,
  'control' | 'getValues' | 'register' | 'reset'
> &
  Pick<FormState<FormData>, 'errors'>;

const Create = () => {
  const {
    handleSubmit,
    formState: { errors, dirtyFields },
    register,
    control,
    watch,
    getValues,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const { t } = useTranslation();

  const handleFormValid = (values) => {
    console.log(values);
    // Prepare data for API post
    // Submit to API
  };

  const filledInTimeTable = watch('timeTable');

  const handleFormInValid = (values) => {
    console.log(values);
  };

  const stepProps = {
    errors: errors,
    control: control,
    getValues: getValues,
    register: register,
    reset: reset,
  };

  return (
    <Page>
      <Page.Title spacing={3} alignItems="center">
        {t(`movies.create.title`)}
      </Page.Title>
      <Page.Content spacing={5} paddingBottom={6} alignItems="flex-start">
        <Step1 {...stepProps} />
        {dirtyFields.theme ? <Step2 {...stepProps} /> : null}
        {dirtyFields.timeTable &&
        filledInTimeTable.some((row) => row.some((cell) => !!cell)) ? (
          <Step3 {...stepProps} />
        ) : null}
        {dirtyFields.cinema ? <Step4 {...stepProps} /> : null}
        <Button onClick={handleSubmit(handleFormValid, handleFormInValid)}>
          Opslaan
        </Button>
      </Page.Content>
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export default Create;
export type { NewProduction, StepProps };
