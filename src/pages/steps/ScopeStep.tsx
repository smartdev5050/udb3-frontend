import { Controller, Path, PathValue } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { OfferType } from '@/constants/OfferType';
import { parseSpacing } from '@/ui/Box';
import { Icons } from '@/ui/Icon';
import { getInlineProps, Inline, InlineProps } from '@/ui/Inline';
import { Stack } from '@/ui/Stack';
import { ToggleBox } from '@/ui/ToggleBox';

import { FormDataUnion, StepProps, StepsConfiguration } from './Steps';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

type Props<TFormData extends FormDataUnion> = InlineProps &
  StepProps<TFormData>;

const IconEvent = ({ width }: { width: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} viewBox="0 0 512 512">
      <path
        fill="#f2fdff"
        d="M462.2 504.5H39.8a25 25 0 0 1-25-25V81.45a25 25 0 0 1 25-25h422.4a25 25 0 0 1 25 25V479.5a25 25 0 0 1-25 25z"
      />
      <path
        fill="#d3ecf5"
        d="M472.2 56.45h-30a25 25 0 0 1 25 25V479.5a25 25 0 0 1-25 25h30a25 25 0 0 0 25-25V81.45a25 25 0 0 0-25-25z"
      />
      <path
        fill="#ed6479"
        d="M462.2 56.45h-13.86l-23.73 10-23.72-10H299.73l-23.73 10-23.73-10H151.11l-23.72 10-23.73-10H39.81a25 25 0 0 0-25 25v82.8h472.38v-82.8a25 25 0 0 0-25-25z"
      />
      <path
        fill="#d65461"
        d="M472.2 56.45h-30a25 25 0 0 1 25 25v82.8h30v-82.8a25 25 0 0 0-25-25z"
      />
      <path
        fill="#fe646f"
        d="M424.61 105.4a23.73 23.73 0 0 0 23.73-23.73V56.45h-47.45v25.22a23.73 23.73 0 0 0 23.72 23.73z"
      />
      <path
        fill="#d65461"
        d="M276 105.4a23.73 23.73 0 0 0 23.73-23.73V56.45h-47.46v25.22A23.73 23.73 0 0 0 276 105.4zm-148.61 0a23.73 23.73 0 0 0 23.72-23.73V56.45h-47.45v25.22a23.73 23.73 0 0 0 23.73 23.73z"
      />
      <path
        fill="#9dc6fb"
        d="M256 105.4a23.73 23.73 0 0 1-23.73-23.73V31.23A23.73 23.73 0 0 1 256 7.5c13.1 0 22.73 10.62 22.73 23.73v50.45c0 13.1-9.63 23.72-22.73 23.72zm-148.61 0a23.73 23.73 0 0 1-23.73-23.73V31.23A23.73 23.73 0 0 1 107.39 7.5c13.1 0 22.72 10.62 22.72 23.73v50.45c0 13.1-9.62 23.72-22.72 23.72zm297.22 0a23.73 23.73 0 0 1-23.72-23.73V31.23A23.73 23.73 0 0 1 404.6 7.5c13.1 0 22.73 10.62 22.73 23.73v50.45c0 13.1-9.62 23.72-22.73 23.72z"
      />
      <path
        fill="#80b4fb"
        d="M404.61 7.5c-3 0-5.86.56-8.5 1.57a23.73 23.73 0 0 1 15.23 22.16v50.44a23.73 23.73 0 0 1-15.23 22.16 23.73 23.73 0 0 0 32.23-22.15V31.22A23.73 23.73 0 0 0 404.61 7.5zM256 7.5c-3 0-5.86.56-8.5 1.57a23.73 23.73 0 0 1 15.23 22.16v50.44a23.75 23.75 0 0 1-15.23 22.16 23.73 23.73 0 0 0 32.23-22.15V31.22A23.73 23.73 0 0 0 256 7.5zm-148.61 0c-3 0-5.86.56-8.5 1.57a23.73 23.73 0 0 1 15.22 22.16v50.44a23.74 23.74 0 0 1-15.22 22.16 23.73 23.73 0 0 0 32.23-22.15V31.22A23.73 23.73 0 0 0 107.38 7.5z"
      />
      <path
        fill="#ed6479"
        d="M443.48 312.12h-81.1a5.27 5.27 0 0 1-5.27-5.26v-81.1a5.27 5.27 0 0 1 5.27-5.27h81.1a5.27 5.27 0 0 1 5.27 5.27v81.1c0 2.9-2.36 5.26-5.27 5.26zM296.55 449.57h-81.1a5.27 5.27 0 0 1-5.27-5.27v-81.1a5.27 5.27 0 0 1 5.27-5.26h81.1a5.27 5.27 0 0 1 5.27 5.26v81.1a5.27 5.27 0 0 1-5.27 5.27zm-146.93 0h-81.1a5.27 5.27 0 0 1-5.27-5.27v-81.1a5.27 5.27 0 0 1 5.27-5.26h81.1a5.27 5.27 0 0 1 5.27 5.26v81.1a5.27 5.27 0 0 1-5.27 5.27zm293.86 0h-81.1a5.27 5.27 0 0 1-5.27-5.27v-81.1a5.27 5.27 0 0 1 5.27-5.26h81.1a5.27 5.27 0 0 1 5.27 5.26v81.1a5.27 5.27 0 0 1-5.27 5.27z"
      />
      <path
        fill="#f9d065"
        d="M296.55 312.12h-81.1a5.27 5.27 0 0 1-5.27-5.26v-81.1a5.27 5.27 0 0 1 5.27-5.27h81.1a5.27 5.27 0 0 1 5.27 5.27v81.1c0 2.9-2.36 5.26-5.27 5.26zm-146.93 0h-81.1a5.27 5.27 0 0 1-5.27-5.26v-81.1a5.27 5.27 0 0 1 5.27-5.27h81.1a5.27 5.27 0 0 1 5.27 5.27v81.1c0 2.9-2.36 5.26-5.27 5.26z"
      />
      <path d="M384.54 497H39.81c-9.65 0-17.5-7.85-17.5-17.5V272.34a7.5 7.5 0 1 0-15 0V479.5A32.54 32.54 0 0 0 39.8 512h344.73a7.5 7.5 0 1 0 0-15zm-22.16-177.38h81.1c7.04 0 12.77-5.72 12.77-12.76v-81.1c0-7.04-5.73-12.77-12.77-12.77h-81.1a12.78 12.78 0 0 0-12.77 12.77v81.1c0 7.04 5.73 12.76 12.77 12.76zm2.23-91.63h76.64v76.63H364.6z" />
      <path d="M202.68 444.3c0 7.04 5.73 12.77 12.77 12.77h81.1c7.04 0 12.77-5.72 12.77-12.77v-81.1c0-7.04-5.73-12.76-12.77-12.76h-81.1a12.78 12.78 0 0 0-12.77 12.76zm15-78.87h76.64v76.64h-76.64zM55.75 444.3c0 7.04 5.73 12.77 12.77 12.77h81.1c7.04 0 12.77-5.72 12.77-12.77v-81.1c0-7.04-5.73-12.76-12.77-12.76h-81.1a12.78 12.78 0 0 0-12.77 12.76zm15-78.87h76.64v76.64H70.75zm278.86 78.87c0 7.04 5.73 12.77 12.77 12.77h81.1c7.04 0 12.77-5.72 12.77-12.77v-81.1c0-7.04-5.73-12.76-12.77-12.76h-81.1a12.78 12.78 0 0 0-12.77 12.76zm15-78.87h76.64v76.64H364.6zm-68.06-152.44h-81.1a12.78 12.78 0 0 0-12.77 12.77v81.1c0 7.04 5.73 12.76 12.77 12.76h81.1c7.04 0 12.77-5.72 12.77-12.76V261.5l19.4-19.53a7.5 7.5 0 0 0-10.65-10.57l-8.75 8.81v-14.45c0-7.04-5.73-12.77-12.77-12.77zm-2.23 91.63h-76.64V228h76.64v27.32l-21.64 21.79-16.43-16.14a7.5 7.5 0 0 0-10.5 10.7l21.74 21.36a7.48 7.48 0 0 0 10.58-.06l16.25-16.36zm-144.7-91.63h-81.1a12.78 12.78 0 0 0-12.77 12.77v81.1c0 7.04 5.73 12.76 12.77 12.76h81.1c7.04 0 12.77-5.72 12.77-12.76V254.7l12.65-12.74a7.5 7.5 0 0 0-10.64-10.57l-2.01 2.03v-7.66c0-7.04-5.73-12.77-12.77-12.77zm-2.23 91.63H70.75V228h76.64v20.53L119 277.09l-16.42-16.13a7.5 7.5 0 1 0-10.52 10.7l21.75 21.36a7.47 7.47 0 0 0 10.58-.06l23-23.16z" />
      <path d="M472.2 48.95h-36.36V31.23C435.84 14 421.84 0 404.61 0 387.4 0 373.4 14 373.4 31.23v17.72h-86.16V31.23C287.23 14 273.22 0 256 0s-31.23 14-31.23 31.23v17.72h-86.16V31.23C138.61 14 124.61 0 107.4 0S76.16 14 76.16 31.23v17.72H39.81a32.54 32.54 0 0 0-32.5 32.5v158.2a7.5 7.5 0 1 0 15 0v-67.9h296.05a7.5 7.5 0 1 0 0-15H22.3v-75.3c0-9.65 7.85-17.5 17.5-17.5h36.35v17.73c0 17.21 14 31.22 31.23 31.22 17.21 0 31.22-14 31.22-31.22V63.95h86.16v17.73c0 17.21 14.01 31.22 31.23 31.22s31.23-14 31.23-31.22V63.95h86.16v17.73c0 17.21 14 31.22 31.23 31.22 17.21 0 31.22-14 31.22-31.22V63.95h36.36c9.64 0 17.5 7.85 17.5 17.5v75.3H351.03a7.5 7.5 0 1 0 0 15H489.7V479.5c0 9.65-7.85 17.5-17.5 17.5h-54.96a7.5 7.5 0 1 0 0 15h54.96a32.54 32.54 0 0 0 32.5-32.5V81.45a32.54 32.54 0 0 0-32.5-32.5zM123.6 81.68c0 8.94-7.28 16.22-16.22 16.22a16.24 16.24 0 0 1-16.23-16.22V31.23c0-8.95 7.28-16.23 16.23-16.23 8.94 0 16.22 7.28 16.22 16.23v50.45zm148.62 0c0 8.94-7.28 16.22-16.23 16.22s-16.23-7.28-16.23-16.22V31.23c0-8.95 7.28-16.23 16.23-16.23s16.23 7.28 16.23 16.23zm148.61 0c0 8.94-7.28 16.22-16.23 16.22a16.24 16.24 0 0 1-16.22-16.22V31.23c0-8.95 7.28-16.23 16.22-16.23 8.95 0 16.23 7.28 16.23 16.23z" />
    </svg>
  );
};

const IconLocation = ({ width }: { width: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} viewBox="0 0 480 480">
      <path
        fill="#ffebd2"
        d="M412.52 30H67.48a8 8 0 0 0-6.92 4L27 92v358h63v-72a8 8 0 0 1 8-8h43a8 8 0 0 1 8 8v72h45V313.81c0-25.48 20.85-46.99 46.33-46.8A46 46 0 0 1 286 313v137h45v-72a8 8 0 0 1 8-8h43a8 8 0 0 1 8 8v72h63V92l-33.56-58a8 8 0 0 0-6.92-4z"
      />
      <path fill="#fff3e4" d="M57 100v350H27V92h22a8 8 0 0 1 8 8z" />
      <path
        fill="#ffbd7b"
        d="M419.43 34.05 453 92H27l33.57-57.95A8 8 0 0 1 67.53 30h344.94a8 8 0 0 1 6.96 4.05z"
      />
      <path
        fill="#80aaff"
        d="M390 160.42V222h-59v-61.58A29.42 29.42 0 0 1 360.42 131 29.41 29.41 0 0 1 390 160.42zm-120 .25V222h-60v-61.33A29.67 29.67 0 0 1 239.67 131c17.94 0 30.33 13.93 30.33 29.67zm-121-.25V222H90v-61.58A29.42 29.42 0 0 1 119.42 131 29.41 29.41 0 0 1 149 160.42z"
      />
      <path
        fill="#fff3e4"
        d="M390 282v41h-59v-41a8 8 0 0 1 8-8h43a8 8 0 0 1 8 8zm-241 0v41H90v-41a8 8 0 0 1 8-8h43a8 8 0 0 1 8 8z"
      />
      <path
        fill="#ffd3a6"
        d="M410.24 50H87.53a8 8 0 0 0-6.96 4.05L58.59 92H27l33.57-57.95A8 8 0 0 1 67.53 30h344.94c11.45 0 11.2 20-2.23 20z"
      />
      <path
        fill="#9cbcff"
        d="M119.94 131c7.81.1 10.43 10.33 3.82 14.5A29.38 29.38 0 0 0 110 170.43V222H90v-61.58A29.42 29.42 0 0 1 119.94 131zm120 0c7.81.1 10.43 10.33 3.82 14.5A29.38 29.38 0 0 0 230 170.43V222h-20v-61.58A29.42 29.42 0 0 1 239.94 131zm121 0c7.81.1 10.43 10.33 3.82 14.5A29.38 29.38 0 0 0 351 170.43V222h-20v-61.58A29.42 29.42 0 0 1 360.94 131z"
      />
      <path
        fill="#fffdfa"
        d="M141.06 284H118a8 8 0 0 0-8 8v31H90v-41a8 8 0 0 1 8-8h43c7.08 0 6.44 10 .06 10zm241 0H359a8 8 0 0 0-8 8v31h-20v-41a8 8 0 0 1 8-8h43c7.08 0 6.44 10 .06 10z"
      />
      <path
        fill="#fff3e4"
        d="M166 395v55h-17v-54a9 9 0 0 1 9-9 8 8 0 0 1 8 8zm241 0v55h-17v-54a9 9 0 0 1 9-9 8 8 0 0 1 8 8zm-104-85v140h-17V292.75c-.04-6.88 9.22-9.27 12.26-3.1A45.87 45.87 0 0 1 303 310z"
      />
      <path d="M472 442h-11V129a8 8 0 0 0-16 0v313h-47v-72a8 8 0 0 0-8-8h-59a8 8 0 0 0-8 8v44.3a8 8 0 0 0 16 0V378h43v64h-88V331.04h124.55a8 8 0 0 0 0-16H398V274a8 8 0 0 0-8-8h-59a8 8 0 0 0-8 8v19.9a8 8 0 0 0 16 0V282h43v33.04h-88V313c0-29.78-24.23-54-54-54-29.78 0-54 24.22-54 54v2.04H98V282h43v7.5a8 8 0 0 0 16 0V274a8 8 0 0 0-8-8H90a8 8 0 0 0-8 8v41.04H35V230h378.39a8 8 0 0 0 0-16H339v-53.58A21.45 21.45 0 0 1 360.42 139 21.44 21.44 0 0 1 382 160.42v25.1a8 8 0 0 0 16 0v-25.1c0-20.4-16.5-37.42-37.58-37.42A37.47 37.47 0 0 0 323 160.42V214h-45v-53.33c0-19.93-15.8-37.67-38.33-37.67A37.71 37.71 0 0 0 202 160.67v25.62a8 8 0 0 0 16 0v-25.62A21.7 21.7 0 0 1 239.67 139c13.46 0 22.33 10.35 22.33 21.67V214H98v-53.58A21.45 21.45 0 0 1 119.42 139 21.44 21.44 0 0 1 141 160.42v32.45a8 8 0 0 0 16 0v-32.45c0-20.4-16.5-37.42-37.58-37.42A37.47 37.47 0 0 0 82 160.42V214H35V94.15L67.48 38h345.04l26.6 46H80a8 8 0 0 0 0 16h373a8 8 0 0 0 6.92-12l-35.86-62a8 8 0 0 0-6.93-4H62.86a8 8 0 0 0-6.92 4L20.07 88A8.22 8.22 0 0 0 19 92v350H8a8 8 0 0 0 0 16h464a8 8 0 0 0 0-16zM35 331.04h151v83.57a8 8 0 0 0 16 0V313c0-20.95 17.05-38 38-38s38 17.05 38 38v129H157v-72a8 8 0 0 0-8-8H90a8 8 0 0 0-8 8v43.13a8 8 0 0 0 16 0V378h43v64H35z" />
    </svg>
  );
};

const ScopeStep = <TFormData extends FormDataUnion>({
  control,
  name,
  setValue,
  ...props
}: Props<TFormData>) => {
  const { t } = useTranslation();
  const { query, replace } = useRouter();

  useEffect(() => {
    if (!query.scope) return;

    if (query.scope === OfferType.EVENTS) {
      setValue(
        'scope' as Path<TFormData>,
        OfferType.EVENTS as PathValue<TFormData, Path<TFormData>>,
      );
    }

    if (query.scope === OfferType.PLACES) {
      setValue(
        'scope' as Path<TFormData>,
        OfferType.PLACES as PathValue<TFormData, Path<TFormData>>,
      );
    }

    replace('', undefined, { shallow: true });
  }, [query]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <Inline
            spacing={5}
            alignItems="center"
            maxWidth={parseSpacing(9)}
            {...getInlineProps(props)}
          >
            <ToggleBox
              onClick={() => field.onChange(OfferType.EVENTS)}
              active={field.value === OfferType.EVENTS}
              icon={<IconEvent width="50" />}
              text={t('steps.offerTypeStep.types.event')}
              width="30%"
              minHeight={parseSpacing(7)}
            />
            <ToggleBox
              onClick={() => field.onChange(OfferType.PLACES)}
              active={field.value === OfferType.PLACES}
              icon={<IconLocation width="50" />}
              text={t('steps.offerTypeStep.types.place')}
              width="30%"
              minHeight={parseSpacing(7)}
            />
          </Inline>
        );
      }}
    />
  );
};

const scopeStepConfiguration: StepsConfiguration<FormDataUnion> = {
  Component: ScopeStep,
  name: 'scope',
  title: ({ t }) => t(`create.scope.title`),
  shouldShowStep: ({ watch, offerId, formState }) => {
    return (
      !offerId &&
      !watch('typeAndTheme')?.type?.id &&
      !formState.dirtyFields.typeAndTheme
    );
  },
};

export { ScopeStep, scopeStepConfiguration };
