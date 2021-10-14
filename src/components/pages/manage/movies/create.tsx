import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Button } from '@/ui/Button';
import { Page } from '@/ui/Page';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

import { Step1 } from './Step1';

const schema = yup
  .object({
    theme: yup.string().required(),
    // timeTable: yup
    //   .array()
    //   .test('has-timeslot', (value) =>
    //     value.some((rows) => rows.some((cell) => !!cell)),
    //   )
    //   .required(),
    // cinema: yup.string().required(),
  })
  .required();

const Create = () => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
    getValues,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { t } = useTranslation();

  const requiredSteps = useMemo(() => [Step1], []);

  const handleFormValid = (values) => {
    console.log(values);
  };

  return (
    <Page>
      <Page.Title spacing={3} alignItems="center">
        {t(`movies.create.title`)}
      </Page.Title>
      <Page.Content spacing={5} paddingBottom={6} alignItems="flex-start">
        {requiredSteps.map((Step, index) => (
          <Step
            key={index}
            errors={errors}
            control={control}
            getValues={getValues}
            register={register}
            reset={reset}
          />
        ))}
        <Button onClick={handleSubmit(handleFormValid)}>Opslaan</Button>
      </Page.Content>
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export default Create;
