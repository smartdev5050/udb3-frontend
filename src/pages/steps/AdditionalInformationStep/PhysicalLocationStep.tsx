import { uniq } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UseQueryResult } from 'react-query';

import { useGetLabelsByQuery } from '@/hooks/api/labels';
import {
  useAddOfferLabelMutation,
  useGetOfferByIdQuery,
  useRemoveOfferLabelMutation,
} from '@/hooks/api/offers';
import {
  TabContentProps,
  ValidationStatus,
} from '@/pages/steps/AdditionalInformationStep/AdditionalInformationStep';
import { Label, Offer } from '@/types/Offer';
import { Alert } from '@/ui/Alert';
import { Badge, BadgeVariants } from '@/ui/Badge';
import { FormElement } from '@/ui/FormElement';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { getGlobalBorderRadius } from '@/ui/theme';
import { Typeahead } from '@/ui/Typeahead';
import { LocationStep } from '@/pages/steps/LocationStep';
import { useForm, useFormContext, useFormState } from 'react-hook-form';

type PhysicalLocationStepProps = StackProps & TabContentProps;

const LABEL_PATTERN = /^[0-9a-zA-Z][0-9a-zA-Z-_\s]{1,49}$/;

function PhysicalLocationStep({
  offerId,
  scope,
  onValidationChange,
  ...props
}: PhysicalLocationStepProps) {
  const { t } = useTranslation();

  return <LocationStep name={'location'} {...props} />;
}

export { PhysicalLocationStep };
