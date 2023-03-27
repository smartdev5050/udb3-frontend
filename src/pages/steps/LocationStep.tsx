import { TFunction } from 'i18next';
import { uniqBy } from 'lodash';
import getConfig from 'next/config';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { EventTypes } from '@/constants/EventTypes';
import { OfferTypes } from '@/constants/OfferType';
import {
  useChangeAttendanceModeMutation,
  useChangeAudienceMutation,
  useChangeLocationMutation,
  useChangeOnlineUrlMutation,
  useDeleteOnlineUrlMutation,
  useGetEventByIdQuery,
} from '@/hooks/api/events';
import { useGetOffersByCreatorQuery } from '@/hooks/api/offers';
import {
  useChangeAddressMutation,
  useGetPlaceByIdQuery,
} from '@/hooks/api/places';
import { useGetUserQuery } from '@/hooks/api/user';
import { SupportedLanguage } from '@/i18n/index';
import { FormData as OfferFormData } from '@/pages/create/OfferForm';
import { Address } from '@/types/Address';
import { Countries, Country } from '@/types/Country';
import { AttendanceMode, AudienceType } from '@/types/Event';
import { Offer } from '@/types/Offer';
import { Values } from '@/types/Values';
import { Alert, AlertVariants } from '@/ui/Alert';
import { parseSpacing } from '@/ui/Box';
import { Button, ButtonVariants } from '@/ui/Button';
import { ButtonCard } from '@/ui/ButtonCard';
import { FormElement } from '@/ui/FormElement';
import { Icon, Icons } from '@/ui/Icon';
import { getInlineProps, Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { LabelPositions, LabelVariants } from '@/ui/Label';
import { RadioButtonTypes } from '@/ui/RadioButton';
import { RadioButtonWithLabel } from '@/ui/RadioButtonWithLabel';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { Breakpoints, getValueFromTheme } from '@/ui/theme';
import { getLanguageObjectOrFallback } from '@/utils/getLanguageObjectOrFallback';
import { parseOfferId } from '@/utils/parseOfferId';
import { prefixUrlWithHttp } from '@/utils/url';

import { CityPicker } from '../CityPicker';
import { Features, NewFeatureTooltip } from '../NewFeatureTooltip';
import { isValidUrl } from './AdditionalInformationStep/ContactInfoStep';
import { CountryPicker } from './CountryPicker';
import { UseEditArguments } from './hooks/useEditField';
import { PlaceStep } from './PlaceStep';
import {
  FormDataUnion,
  getStepProps,
  StepProps,
  StepsConfiguration,
} from './Steps';
import { ToggleBox } from '@/ui/ToggleBox';

const { publicRuntimeConfig } = getConfig();

const CULTUURKUUR_LOCATION_ID = publicRuntimeConfig.cultuurKuurLocationId;
const API_URL = publicRuntimeConfig.apiUrl;

const getGlobalValue = getValueFromTheme('global');

const OnlineLocationIcon = ({ width }) => (
  <svg
    xmlSpace="preserve"
    width={width}
    viewBox="0 0 682.66669 682.66669"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <clipPath clipPathUnits="userSpaceOnUse" id="a">
        <path d="M0 512h512V0H0z" />
      </clipPath>
    </defs>
    <g clipPath="url(#a)" transform="matrix(1.33333 0 0 -1.33333 0 682.667)">
      <path
        d="M0 0h-403.227v270.149c0 5.523 4.477 10 10 10H-10c5.522 0 10-4.477 10-10z"
        fill="#a79ca7"
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(457.727 114.45)"
      />
      <path
        d="M0 0h-64.5c-5.523 0-10-4.478-10-10v-270.148H-10V-10C-10-4.478-5.523 0 0 0"
        fill="#918291"
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(129 394.6)"
      />
      <path
        d="M0 0h-71.5c-5.523 0-10-4.478-10-10v-270.148h403.227V-10c0 5.522-4.478 10-10 10H35"
        fill="none"
        stroke="#000"
        strokeWidth={15}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeDasharray="none"
        strokeOpacity={1}
        transform="translate(136 394.6)"
      />
      <path
        d="M0 0v193.958a5 5 0 005 5h334.618a5 5 0 005-5V0a5 5 0 00-5-5H5a5 5 0 00-5 5"
        fill="#eaf6ff"
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(83.69 166.286)"
      />
      <path
        d="M0 0v193.958a5 5 0 005 5h-41.691a5 5 0 01-5-5V0a5 5 0 015-5H5a5 5 0 00-5 5"
        fill="#d8ecfe"
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(125.382 166.286)"
      />
      <path
        d="M0 0h-159.809v-203.958H0a5 5 0 015 5V-5a5 5 0 01-5 5"
        fill="#00c27a"
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(423.31 365.244)"
      />
      <path
        d="M263.5 161.286H295v203.958h-31.5z"
        fill="#09a755"
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
      />
      <path
        d="M0 0v91.244a5 5 0 01-5 5h-159.809v-203.958H-5a5 5 0 015 5V-35"
        fill="none"
        stroke="#000"
        strokeWidth={15}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeDasharray="none"
        strokeOpacity={1}
        transform="translate(428.31 269)"
      />
      <path
        d="M0 0h-487a5 5 0 01-5-5v-26.338a5 5 0 015-5H0a5 5 0 015 5V-5a5 5 0 01-5 5"
        fill="#e2dee2"
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(499.5 131.982)"
      />
      <path
        d="M0 0v26.338a5 5 0 005 5h-80.5a5 5 0 01-5-5V0a5 5 0 015-5H5a5 5 0 00-5 5"
        fill="#cbc4cb"
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(88 100.644)"
      />
      <path
        d="M0 0h123.5a5 5 0 015 5v26.338a5 5 0 01-5 5h-487a5 5 0 01-5-5V5a5 5 0 015-5H-35"
        fill="none"
        stroke="#000"
        strokeWidth={15}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeDasharray="none"
        strokeOpacity={1}
        transform="translate(376 95.644)"
      />
      <path
        d="M0 0h-174.809a5 5 0 01-5-5v-193.958a5 5 0 015-5H0z"
        fill="none"
        stroke="#000"
        strokeWidth={15}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeDasharray="none"
        strokeOpacity={1}
        transform="translate(263.5 365.244)"
      />
      <path
        d="M0 0h-138.257a5 5 0 01-5-5v-91.745a5 5 0 015-5h14.71a5 5 0 005-5v-22.337c0-4.121 4.703-6.473 8-4l40.448 30.337c.866.649 1.919 1 3.001 1H0a5 5 0 015 5V-5a5 5 0 01-5 5"
        fill="#fed402"
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(499.5 416.356)"
      />
      <path
        d="M0 0a5 5 0 01-5 5h-14.709a5 5 0 00-5 5v86.101h-26.5a5 5 0 01-5-5V-.645a5 5 0 015-5H-36.5a5 5 0 005-5v-22.336c0-4.122 4.704-6.473 8-4L0-19.356z"
        fill="#fac600"
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(412.453 320.255)"
      />
      <path
        d="M0 0h-138.257a5 5 0 01-5-5v-91.745a5 5 0 015-5h14.71a5 5 0 005-5v-22.337c0-4.121 4.703-6.473 8-4l40.448 30.337c.866.649 1.919 1 3.001 1H0a5 5 0 015 5V-5a5 5 0 01-5 5z"
        fill="none"
        stroke="#000"
        strokeWidth={15}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeDasharray="none"
        strokeOpacity={1}
        transform="translate(499.5 416.356)"
      />
      <path
        d="M0 0h61.047"
        fill="none"
        stroke="#000"
        strokeWidth={15}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeDasharray="none"
        strokeOpacity={1}
        transform="translate(399.848 382.198)"
      />
      <path
        d="M0 0h61.047"
        fill="none"
        stroke="#000"
        strokeWidth={15}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeDasharray="none"
        strokeOpacity={1}
        transform="translate(399.848 348.768)"
      />
      <path
        d="M0 0c-21.438 0-39.018-16.421-40.905-37.368l81.809.001C39.018-16.421 21.437 0 0 0"
        fill="#27a5fe"
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(173.596 300.633)"
      />
      <path
        d="M0 0c-21.438 0-39.018-16.421-40.905-37.367h31.309C-8.197-21.84 1.829-8.808 15.654-3.1A40.897 40.897 0 010 0"
        fill="#0593fc"
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(173.596 300.633)"
      />
      <path
        d="M0 0c-21.438 0-39.018-16.421-40.905-37.368l81.809.001C39.018-16.421 21.437 0 0 0z"
        fill="none"
        stroke="#000"
        strokeWidth={15}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeDasharray="none"
        strokeOpacity={1}
        transform="translate(173.596 300.633)"
      />
      <path
        d="M0 0c0-12.339-10.003-22.342-22.342-22.342-12.34 0-22.343 10.003-22.343 22.342 0 12.34 10.003 22.343 22.343 22.343C-10.003 22.343 0 12.34 0 0"
        fill="#27a5fe"
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(195.938 320.212)"
      />
      <path
        d="M0 0c0-12.339-10.003-22.342-22.342-22.342-12.34 0-22.343 10.003-22.343 22.342 0 12.34 10.003 22.343 22.343 22.343C-10.003 22.343 0 12.34 0 0z"
        fill="none"
        stroke="#000"
        strokeWidth={15}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeDasharray="none"
        strokeOpacity={1}
        transform="translate(195.938 320.212)"
      />
      <path
        d="M0 0c-21.438 0-39.018-16.421-40.905-37.367h81.809C39.018-16.421 21.437 0 0 0"
        fill="#fe6c55"
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(173.596 198.653)"
      />
      <path
        d="M0 0a40.918 40.918 0 01-15.654 3.099c-21.438 0-39.018-16.421-40.905-37.368h31.309C-23.852-18.74-13.825-5.708 0 0"
        fill="#fd544c"
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(189.25 195.555)"
      />
      <path
        d="M0 0c-21.438 0-39.018-16.421-40.905-37.367h81.809C39.018-16.421 21.437 0 0 0z"
        fill="none"
        stroke="#000"
        strokeWidth={15}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeDasharray="none"
        strokeOpacity={1}
        transform="translate(173.596 198.653)"
      />
      <path
        d="M0 0c0-12.339-10.003-22.343-22.342-22.343-12.34 0-22.343 10.004-22.343 22.343 0 12.34 10.003 22.343 22.343 22.343C-10.003 22.343 0 12.34 0 0"
        fill="#fe6c55"
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(195.938 218.233)"
      />
      <path
        d="M0 0c0-12.339-10.003-22.343-22.342-22.343-12.34 0-22.343 10.004-22.343 22.343 0 12.34 10.003 22.343 22.343 22.343C-10.003 22.343 0 12.34 0 0z"
        fill="none"
        stroke="#000"
        strokeWidth={15}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeDasharray="none"
        strokeOpacity={1}
        transform="translate(195.938 218.233)"
      />
      <path
        d="M0 0h-174.809a5 5 0 01-5-5v-193.958a5 5 0 015-5H0z"
        fill="none"
        stroke="#000"
        strokeWidth={15}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeDasharray="none"
        strokeOpacity={1}
        transform="translate(263.5 365.244)"
      />
      <path
        d="M0 0v-96.979h179.809V5H5a5 5 0 01-5-5z"
        fill="none"
        stroke="#000"
        strokeWidth={15}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeDasharray="none"
        strokeOpacity={1}
        transform="translate(83.69 360.244)"
      />
      <path
        d="M0 0c-27.771 0-50.544-21.271-52.988-48.406H52.989C50.545-21.271 27.771 0 0 0"
        fill="#f3f0f3"
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(345.904 209.692)"
      />
      <path
        d="M0 0a53.17 53.17 0 01-15.542 2.316c-27.771 0-50.544-21.271-52.988-48.406h31.084C-35.479-24.24-20.325-6.202 0 0"
        fill="#e2dee2"
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(361.446 207.376)"
      />
      <path
        d="M0 0c-27.771 0-50.544-21.271-52.988-48.406H52.989C50.545-21.271 27.771 0 0 0z"
        fill="none"
        stroke="#000"
        strokeWidth={15}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeDasharray="none"
        strokeOpacity={1}
        transform="translate(345.904 209.692)"
      />
      <path
        d="M0 0c0-15.984-12.958-28.942-28.943-28.942-15.985 0-28.943 12.958-28.943 28.942 0 15.985 12.958 28.943 28.943 28.943C-12.958 28.943 0 15.985 0 0"
        fill="#fff"
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(374.848 235.057)"
      />
      <path
        d="M0 0c0 12.441 7.851 23.046 18.867 27.138a28.868 28.868 0 01-10.076 1.805C-7.194 28.943-20.152 15.985-20.152 0c0-15.984 12.958-28.943 28.943-28.943 3.544 0 6.938.64 10.076 1.805C7.851-23.045 0-12.44 0 0"
        fill="#f3f0f3"
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(337.114 235.057)"
      />
      <path
        d="M0 0c0-15.984-12.958-28.942-28.943-28.942-15.985 0-28.943 12.958-28.943 28.942 0 15.985 12.958 28.943 28.943 28.943C-12.958 28.943 0 15.985 0 0z"
        fill="none"
        stroke="#000"
        strokeWidth={15}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeDasharray="none"
        strokeOpacity={1}
        transform="translate(374.848 235.057)"
      />
      <path
        d="M0 0a7.5 7.5 0 00-7.5-7.5A7.5 7.5 0 00-15 0a7.5 7.5 0 007.5 7.5A7.5 7.5 0 000 0"
        fill="#000"
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(299 337.5)"
      />
      <path
        d="M0 0a7.5 7.5 0 00-7.5-7.5A7.5 7.5 0 00-15 0a7.5 7.5 0 007.5 7.5A7.5 7.5 0 000 0"
        fill="#000"
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(320 337.5)"
      />
    </g>
  </svg>
);

const PhysicalLocationIcon = ({ width }) => (
  <svg
    viewBox="0 0 512.093 512.093"
    width={width}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M278.76 140.309c-25.386-27.557-40.989-75.154-8.644-126.097 4.303-6.774 13.278-8.779 20.05-4.474 6.771 4.305 8.773 13.287 4.471 20.063-29.594 46.611-3.285 81.288 5.484 90.806l10.568 10.54-19.333 18.667zM456.275 120.606c8.769-9.518 35.078-44.195 5.484-90.806-4.302-6.776-2.3-15.758 4.471-20.063 6.772-4.305 15.747-2.3 20.05 4.474 32.344 50.944 16.742 98.54-8.644 126.097l-25.948 7.171zM409.085 73.326v16.98c0 17.889-14.502 32.391-32.391 32.391-17.889 0-32.391-14.502-32.391-32.391v-16.98z"
      fill="#ffe8d9"
    />
    <path
      d="M358.171 152.54l6.557-33.727h23.931l10.41 35.942v18.406h-40.898z"
      fill="#ffe8d9"
    />
    <path
      d="M347.853 481.239l-4.901-33.838a161.431 161.431 0 0114.066-92.653l10.74-22.509c1.22-2.557 5.069-1.563 4.901 1.265l-1.96 32.996a161.429 161.429 0 007.085 57.79l17.824 56.949h31.65l-8.928-41.156a161.44 161.44 0 014.223-84.085l6.11-18.815a74.672 74.672 0 002.79-34.373l-3.59-23.438-51.169-17.059-48.208 17.059-20.591 72.886a161.45 161.45 0 00-2.61 77.184l10.918 51.798 15.819 7.073z"
      fill="#9b4f1d"
    />
    <path
      d="M428.662 337.182a74.672 74.672 0 002.79-34.373l-3.59-23.438h-40l3.59 23.438a74.7 74.7 0 01-2.79 34.373l-6.11 18.815a161.43 161.43 0 00-7.704 57.643c.856 3.578 1.835 7.13 2.936 10.649l17.823 56.949 17.414 7.073 14.236-7.073-8.928-41.156a161.44 161.44 0 014.223-84.085z"
      fill="#8f491b"
    />
    <path d="M344.302 73.326V22.313s64.783-1.5 64.783 51.013z" fill="#9b4f1d" />
    <g>
      <path
        d="M47.294 210.159c-28.155 21.23-50.038 60.161-34.742 112.765 2.242 7.706 10.302 12.135 18.006 9.89 7.703-2.245 12.131-10.312 9.891-18.019-12.545-43.142 8.255-68.368 22.406-79.875l3.009-2.278 3.361-22.955-17.997-2.202z"
        fill="#ffe8d9"
      />
      <path
        d="M174.031 492.88v-11.797h31.65a28.598 28.598 0 0120.23 8.385c5.449 5.452 1.601 14.775-6.104 14.792l-34.325.053c-6.321.013-11.451-5.109-11.451-11.433zM94.626 492.88v-11.797h31.65a28.598 28.598 0 0120.23 8.385c5.449 5.452 1.601 14.775-6.104 14.792l-34.325.053c-6.321.013-11.451-5.109-11.451-11.433z"
        fill="#3aeee6"
      />
      <path
        d="M222.836 231.897c-1.506 15.729.052 54.627 47.151 74.81 7.377 3.161 10.798 11.704 7.643 19.081-3.156 7.378-11.695 10.793-19.072 7.633-50.874-21.801-67.014-66.065-65.16-101.524l15.624-16.15z"
        fill="#ffe8d9"
      />
      <g fill="#ffe8d9">
        <path d="M177.581 103.169v16.98c0 17.889-14.502 32.391-32.391 32.391-17.889 0-32.391-14.502-32.391-32.391v-18.971c0-17.875 14.491-32.365 32.365-32.365 18.91.633 32.454 15.792 32.417 34.356z" />
        <path d="M156.323 140.575h-23.932L122.2 189.42s6.154 9.393 21.988 9.393 21.667-12.833 21.667-12.833z" />
      </g>
      <path
        d="M174.67 173.161h-9.815c-.915 10.887-10.03 19.439-21.146 19.439-19.493 0-19.687-17.287-19.687-17.287-11.223-1.333-31.333 2.833-46.5 10.5-7.503 3.793-29.013 17-29.013 17l21.333 36.667 23.705-14.982v-12.729 97.445l51.643 10.598 48.208-10.598v-77.318h33.438v-6.73a52.006 52.006 0 00-52.006-52.006h-.16"
        fill="#3aeee6"
      />
      <g>
        <path
          d="M174.031 87.407c-5.208-10.715-15.743-18.155-28.867-18.594-17.875 0-32.365 14.49-32.365 32.365v9.498h1.898c-.001 0 39.856 6.325 59.334-23.269z"
          fill="#1c337a"
        />
      </g>
    </g>
    <path
      d="M174.031 481.082l23.816-61.406a36.35 36.35 0 00-6.924-37.519l-28.731-31.785c-.22-.156-.387-.369-.536-.594a2.445 2.445 0 00-1.426-1.031c-2.133-.564-3.725 2.033-2.425 3.816l9.802 28.059a36.352 36.352 0 01-2.435 29.45l-38.895 71.011h-31.65l27.968-61.375a36.351 36.351 0 00-6.798-40.187l-11.375-11.903a49.033 49.033 0 01-13.019-41.301l2.619-17.102h99.377l41.131 64.939a36.353 36.353 0 012.67 33.845l-31.518 73.084h-31.651z"
      fill="#2f4ca3"
    />
    <path
      d="M328.486 279.371v-77.31a39.186 39.186 0 00-14.567-30.49l-35.561-28.71 24.843-24.859 12.067 12.075a45.16 45.16 0 0031.945 13.241h.001c5.126 0 9.663 3.036 11.941 7.63 3.471 6.998 10.682 11.809 19.019 11.809s15.549-4.811 19.019-11.809l.474-.888c2.278-4.594 6.816-7.63 11.941-7.63h.001a45.16 45.16 0 0031.945-13.241l12.067-12.075 24.843 24.859-35.561 28.71a39.186 39.186 0 00-14.567 30.49v78.198z"
      fill="#fed73a"
    />
    <g>
      <path
        d="M453.622 117.115l-12.067 12.075a45.148 45.148 0 01-3.665 3.277l.576.576-35.561 28.71a39.186 39.186 0 00-14.567 30.49v87.129h40v-78.198a39.186 39.186 0 0114.567-30.49l35.561-28.71z"
        fill="#fc0"
      />
    </g>
    <g fill="#2f4ca3">
      <path d="M347.853 493.037V481.24h-31.65a28.598 28.598 0 00-20.23 8.385c-5.449 5.452-1.601 14.775 6.104 14.792l34.325.054c6.32.012 11.451-5.11 11.451-11.434zM427.258 493.037V481.24h-31.65a28.598 28.598 0 00-20.23 8.385c-5.449 5.452-1.601 14.775 6.104 14.792l34.325.054c6.32.012 11.451-5.11 11.451-11.434z" />
    </g>
    <g>
      <path d="M435.277 278.236a7.502 7.502 0 00-7.414-6.365h-91.877V202.06c0-14.18-6.326-27.42-17.356-36.325l-29.071-23.472 13.643-13.652 6.763 6.767c9.95 9.956 23.179 15.438 37.251 15.438 2.162 0 4.163 1.327 5.222 3.462 4.887 9.855 14.749 15.977 25.738 15.977 11.063 0 21.455-6.99 26.212-16.864 1.06-2.135 3.061-3.462 5.224-3.462 14.071 0 27.301-5.483 37.25-15.439l6.763-6.767 13.643 13.652-29.073 23.471c-11.029 8.905-17.354 22.145-17.354 36.326V243.9c0 9.697 15 9.697 15 0v-42.726c0-9.625 4.293-18.612 11.777-24.655l35.562-28.709c1.875-1.633 2.801-3.495 2.778-5.586 25.576-29.994 40.076-79.397 6.657-132.034-15.188-23.91-52.407-.346-37.184 23.63 22.505 35.445 9.371 63.079-.03 76.016-2.532-.614-4.892.044-7.081 1.976l-12.067 12.075c-7.116 7.121-16.578 11.042-26.642 11.042-2.768 0-5.44.565-7.903 1.599l-3.539-12.632c11.065-7.098 18.418-19.498 18.418-33.592v-16.98c0-15.718-5.151-28.722-15.312-38.649-20.938-20.458-55.682-19.897-57.146-19.862a7.5 7.5 0 00-7.326 7.498v67.993c0 14.784 8.09 27.705 20.07 34.596l-2.849 12.09a20.406 20.406 0 00-6.809-1.174c-10.063 0-19.524-3.921-26.641-11.042L308.505 112.7c-2.124-1.878-4.42-2.552-6.888-2.024-9.421-12.554-23.654-40.623-.648-76.855 15.048-23.703-21.789-47.866-37.185-23.629-33.604 52.927-18.756 102.588 7.084 132.532-.003.179-.009.357 0 .537a7.498 7.498 0 002.778 5.436l35.561 28.71c7.485 6.043 11.778 15.029 11.778 24.654v76.271l-20.309 71.887c-7.401 26.2-8.346 54.13-2.73 80.77l9.249 43.882c-6.199 1.586-11.884 4.806-16.527 9.452-9.973 9.978-2.71 27.562 11.397 27.594l34.319.053c10.093 0 18.968-8.823 18.968-18.933.938-15.627-2.752-31.342-4.978-46.71-4.366-30.147.234-60.614 13.304-88.122l-.467 7.851a168.325 168.325 0 007.415 60.475l15.196 48.555c-5.896 1.651-11.302 4.787-15.75 9.237-9.973 9.978-2.71 27.562 11.397 27.594l34.319.053c10.093 0 18.968-8.823 18.968-18.933 1.531-18.221-5.286-36.966-9.1-54.544a154.106 154.106 0 014.026-80.178c6.06-18.658 12.265-36.518 9.181-56.64zm32.814-252.455c-4.708-7.413 6.992-15.213 11.857-7.549 28.004 44.108 17.435 85.413-3.132 111.483l-10.034-10.041c11.634-15.477 29.221-49.933 1.309-93.893zM351.802 30.18c9.925.926 27.686 4.145 39.032 15.268 5.605 5.495 8.979 12.207 10.214 20.378h-49.246zm0 50.646h49.783v9.48c0 13.725-11.166 24.891-24.892 24.891s-24.892-11.166-24.892-24.891v-9.48zm24.892 49.371a39.98 39.98 0 007.462-.71l5.484 19.575a13.631 13.631 0 01-11.465 6.195 13.629 13.629 0 01-11.553-6.335l4.507-19.121c1.819.255 3.675.396 5.565.396zM276.447 18.233c4.758-7.495 16.652-.004 11.858 7.547-28.372 44.683-9.738 79.545 1.875 94.639l-10.02 10.026c-20.946-26.025-31.978-67.692-3.713-112.212zm63.906 474.803c0 1.95-1.948 3.933-3.939 3.933l-34.319-.053c-1.155-.299-1.427-.962-.816-1.99a20.966 20.966 0 0114.905-6.186h.012l.028-.001h24.13v4.297zm79.405 0c0 1.95-1.948 3.933-3.939 3.933l-34.319-.053c-1.155-.299-1.427-.962-.816-1.99a20.964 20.964 0 0114.925-6.187h24.15v4.297zm1.771-158.17l-6.111 18.815A169.122 169.122 0 00411 441.673l6.956 32.066h-16.837l-16.178-51.69a153.413 153.413 0 01-6.756-55.104l1.961-32.996c.64-10.798-14.499-14.708-19.157-4.939l-10.741 22.509c-14.434 30.253-19.523 63.781-14.719 96.958l3.659 25.263h-16.901l-9.662-45.845c-5.117-24.275-4.257-49.725 2.488-73.598l19.048-67.425h87.263l2.615 17.074c1.579 10.308.711 21-2.51 30.92z" />
      <path d="M272.941 299.813c-37.322-15.993-43.017-44.761-42.939-61.124a7.494 7.494 0 004.335-6.792c.694-39.993-27.14-67.049-66.752-66.236l-2.573-10.916c11.979-6.891 20.07-19.812 20.07-34.596v-16.98c.038-23.102-17.012-41.094-39.666-41.852a7.003 7.003 0 00-.251-.004c-21.982 0-39.866 17.883-39.866 39.865v18.971c0 14.094 7.354 26.494 18.418 33.592l-3.539 12.631c-28.429-5.914-56.231 16.053-76.058 30.358a7.5 7.5 0 00-2.708 8.502c-6.402 4.985-12.244 10.637-17.365 16.837-6.087 7.37 5.253 17.191 11.564 9.553a95.706 95.706 0 0113.305-13.195l7.196 12.368c-15.168 13.129-36.096 40.596-22.865 86.094 2.452 8.433-10.958 12.657-13.493 3.94-6.408-22.037-6.323-42.774.254-61.635 3.192-9.158-10.97-14.093-14.164-4.938-7.623 21.863-7.789 45.671-.493 70.764 7.909 27.187 50.23 14.949 42.3-12.319-9.943-34.192 2.451-55.893 16.207-68.71 2.351 3.119 6.755 3.874 9.991 1.829l12.198-7.709v70.217c0 .64.089 1.257.239 1.85l-2.298 15.005c-2.638 17.221 2.973 35.021 15.01 47.618 11.713 12.257 25.287 25.108 16.771 43.798l-27.968 61.375a7.744 7.744 0 00-.675 3.11v11.797c0 10.325 8.678 18.933 18.962 18.933l34.33-.054c14.108-.03 21.36-17.62 11.392-27.594a35.946 35.946 0 00-13.921-8.673l33.859-61.818c6.994-12.769 6.361-26.767 1.361-40.04l12.249 13.551c7.356 8.139 9.463 19.549 5.496 29.778l-23.816 61.406a7.599 7.599 0 00-.508 2.712v11.797c0 10.325 8.679 18.933 18.963 18.933l34.329-.054c14.108-.03 21.361-17.619 11.393-27.594-4.215-4.217-9.289-7.26-14.827-8.972l27.697-64.225a43.823 43.823 0 00-3.221-40.828l-39.967-63.101v-12.643c11.902 19.625 30.538 35.562 54.707 45.919 25.813 11.058 43.696-29.206 17.337-40.501zm-127.902-223.5c8.356.318 15.494 4.378 19.988 10.639-13.451 16.198-35.385 17.123-44.729 16.689-.644-14.285 9.907-27.255 24.741-27.328zm-24.741 42.373c17.607.745 36.247-3.692 49.783-15.454v16.917c0 13.725-11.166 24.892-24.892 24.892s-24.892-11.167-24.892-24.892v-1.463zm24.892 41.354c1.889 0 3.746-.141 5.566-.397l4.501 19.096c-5.231 8.128-17.662 8.343-23.013.165l5.484-19.575c2.419.461 4.911.711 7.462.711zm-72.778 68.943L58.41 204.917 77.838 190.9c10.088-7.279 21.996-11.126 34.437-11.126 2.162 0 4.163 1.327 5.223 3.462 4.884 10.138 14.849 16.864 26.212 16.864 12.079 0 23.229-8.044 27.167-19.439h3.954c14.124 0 27.542 6.801 35.894 18.192 5.482 7.479 8.45 16.295 8.605 25.543h-18.432v-9.031c0-9.386-15-9.813-15 0v86.349h-84.851v-89.945c0-9.386-15-9.813-15 0v8.596zm69.041 267.058c-.296.716-.837.717-1.063.718l-34.33.054c-3.907 0-4.539-5.37-3.934-8.23h24.149a20.96 20.96 0 0114.925 6.187c.151.15.551.55.253 1.271zm79.406 0c-.296.717-.838.718-1.064.718l-34.329.054c-3.908 0-4.54-5.37-3.935-8.23h24.108l.039.002.018-.001a20.963 20.963 0 0114.911 6.186c.149.149.549.55.252 1.271zm9.453-91.013l-29.564 68.554h-15.764l19.856-51.194c6.03-15.547 2.829-32.89-8.354-45.26l-28.73-31.785c-7.524-8.376-22.742-1.054-16.792 10.38l9.563 27.373a28.898 28.898 0 01-1.934 23.374l-36.76 67.113h-15.547l23.134-50.766c11.288-24.774-3.353-43.404-19.576-60.381-8.843-9.254-12.966-22.332-11.028-34.984l1.645-10.737h88.811l38.922 61.452a28.838 28.838 0 012.118 26.861zm40.423-82.191c-2.054 3.778-5.129 5.008-9.223 3.69-21.994-9.425-38.388-23.377-48.725-41.467-9.528-16.675-11.882-33.311-11.888-45.664h14.092c.02 8.811 1.421 19.801 6.299 31.188 8.151 19.03 23.542 33.502 45.742 43.016 3.567 1.529 5.227 5.673 3.703 9.237z" />
      <path d="M74.786 378.982c-5.285-1.031-8.856-6.456-7.959-12.092 1.523-9.577-13.289-11.934-14.814-2.357-2.152 13.525 6.775 26.612 19.902 29.172 9.221 1.803 12.23-12.898 2.871-14.723z" />
      <path d="M63.96 400.913c-13.937-2.719-23.38-16.841-21.05-31.481 1.523-9.576-13.289-11.936-14.814-2.357-3.585 22.528 11.215 44.313 32.993 48.562 9.221 1.802 12.23-12.899 2.871-14.724zM461.346 330.53a7.465 7.465 0 004.437 1.458 7.489 7.489 0 006.048-3.058c8.113-11.034 6.178-26.757-4.314-35.05a7.5 7.5 0 00-9.301 11.769c4.226 3.339 4.912 9.797 1.531 14.396a7.498 7.498 0 001.599 10.485z" />
      <path d="M483.766 339.235a7.47 7.47 0 004.438 1.458 7.489 7.489 0 006.048-3.058c13.515-18.378 10.348-44.523-7.06-58.282a7.5 7.5 0 00-9.301 11.768c11.14 8.805 13.058 25.685 4.276 37.628a7.5 7.5 0 001.599 10.486zM212.977 56.068c4.109 8.509 17.759 2.289 13.51-6.52-2.341-4.851-.137-10.959 4.914-13.618 8.305-4.372 1.697-17.844-6.986-13.273-12.12 6.379-17.251 21.367-11.438 33.411z" />
      <path d="M195.692 64.779c5.413 0 9.117-5.855 6.749-10.762-6.172-12.789-.521-28.81 12.598-35.714 8.306-4.371 1.695-17.848-6.986-13.273-20.187 10.624-28.765 35.524-19.121 55.507a7.502 7.502 0 006.76 4.242zM88.652 14.268a7.499 7.499 0 00-6.829-1.025L38.801 27.956a7.5 7.5 0 00-5.072 6.996l-.479 35.471c-.434-.04-.869-.078-1.312-.084-9.026-.122-16.442 7.097-16.564 16.123s7.097 16.442 16.123 16.564 16.442-7.097 16.564-16.123c.003-.217-.018-.429-.024-.644l.618-45.82 27.951-9.559-.328 24.283c-.442-.042-.886-.08-1.338-.086-9.026-.122-16.442 7.097-16.564 16.123s7.097 16.442 16.123 16.564 16.442-7.097 16.564-16.123c.001-.043-.005-.085-.005-.129l.689-51.072a7.495 7.495 0 00-3.095-6.172zM502.511 416.777l-25.396-25.396a7.499 7.499 0 00-12.803 5.202l-.48 35.507c-.322-.024-.641-.058-.967-.062-8.836-.119-16.095 6.947-16.215 15.783-.119 8.836 6.947 16.095 15.782 16.215 8.836.119 16.095-6.947 16.215-15.783.003-.218-.018-.431-.024-.647l.447-33.045 12.833 12.833a7.498 7.498 0 0010.606 0 7.499 7.499 0 00.002-10.607z" />
    </g>
  </svg>
);

const RecentLocations = ({ onFieldChange, ...props }) => {
  const { t, i18n } = useTranslation();
  const getUserQuery = useGetUserQuery();
  const getOffersQuery = useGetOffersByCreatorQuery(
    {
      advancedQuery: '_exists_:location.id',
      // @ts-expect-error
      creator: getUserQuery?.data,
      sortOptions: {
        field: 'modified',
        order: 'desc',
      },
      paginationOptions: { start: 0, limit: 20 },
    },
    {
      queryArguments: {
        workflowStatus: 'DRAFT,READY_FOR_VALIDATION,APPROVED',
        addressCountry: '*',
      },
    },
  );

  const offers: (Offer & { location: any })[] =
    // @ts-expect-error
    getOffersQuery?.data?.member ?? [];
  const locations = uniqBy(
    offers?.map((offer) => offer.location),
    '@id',
  ).filter((location) => location && location.name.nl !== 'Online');

  return (
    <Stack {...props}>
      <Inline>
        <Text fontWeight={'bold'}>
          {t('create.location.recent_locations.title')}
        </Text>
        <NewFeatureTooltip featureUUID={Features.SUGGESTED_ORGANIZERS} />
      </Inline>
      <Alert variant={AlertVariants.PRIMARY} marginY={4}>
        {t('create.location.recent_locations.info')}
      </Alert>
      <Inline
        display={'grid'}
        css={`
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        `}
      >
        {locations.map((location) => {
          const address =
            location.address[location.mainLanguage] ?? location.address;

          return (
            <ButtonCard
              key={location['@id']}
              width={'auto'}
              marginBottom={0}
              onClick={() =>
                onFieldChange({
                  municipality: {
                    zip: address.postalCode,
                    label: `${address.postalCode} ${address.addressLocality}`,
                    name: address.addressLocality,
                  },
                  place: location,
                })
              }
              title={getLanguageObjectOrFallback(
                location.name,
                i18n.language as SupportedLanguage,
                location?.mainLanguage ?? 'nl',
              )}
              description={
                address && (
                  <>
                    {address.streetAddress}
                    <br />
                    {address.postalCode} {address.addressLocality}
                  </>
                )
              }
            />
          );
        })}
      </Inline>
    </Stack>
  );
};

const useEditLocation = ({ scope, offerId }: UseEditArguments) => {
  const { i18n } = useTranslation();
  const changeAddressMutation = useChangeAddressMutation();
  const changeOnlineUrl = useChangeOnlineUrlMutation();
  const deleteOnlineUrl = useDeleteOnlineUrlMutation();
  const changeAttendanceMode = useChangeAttendanceModeMutation();
  const changeAudienceMutation = useChangeAudienceMutation();
  const changeLocationMutation = useChangeLocationMutation();

  return async ({ location }: FormDataUnion) => {
    // For places

    if (scope === OfferTypes.PLACES) {
      if (!location.municipality || !location.streetAndNumber) return;

      const address: Address = {
        [i18n.language]: {
          streetAddress: location.streetAndNumber,
          addressCountry: location.country,
          addressLocality: location.municipality.name,
          postalCode: location.municipality.zip,
        },
      };

      changeAddressMutation.mutate({
        id: offerId,
        address: address[i18n.language],
        language: i18n.language,
      });

      return;
    }

    // For events

    if (location.isOnline) {
      await changeAttendanceMode.mutateAsync({
        eventId: offerId,
        attendanceMode: AttendanceMode.ONLINE,
      });

      if (location.onlineUrl) {
        changeOnlineUrl.mutate({
          eventId: offerId,
          onlineUrl: location.onlineUrl,
        });
      } else {
        deleteOnlineUrl.mutate({
          eventId: offerId,
        });
      }

      return;
    }

    const isCultuurkuur = !location.country;

    if (isCultuurkuur) {
      await changeAttendanceMode.mutateAsync({
        eventId: offerId,
        attendanceMode: AttendanceMode.OFFLINE,
        location: `${API_URL}/place/${CULTUURKUUR_LOCATION_ID}`,
      });

      const changeLocationPromise = changeLocationMutation.mutateAsync({
        locationId: CULTUURKUUR_LOCATION_ID,
        eventId: offerId,
      });

      const changeAudiencePromise = changeAudienceMutation.mutateAsync({
        eventId: offerId,
        audienceType: AudienceType.EDUCATION,
      });

      await Promise.all([changeLocationPromise, changeAudiencePromise]);

      return;
    }

    if (!location.place) return;

    await changeAttendanceMode.mutateAsync({
      eventId: offerId,
      attendanceMode: AttendanceMode.OFFLINE,
      location: location.place['@id'],
    });

    if (parseOfferId(location.place['@id']) !== CULTUURKUUR_LOCATION_ID) {
      changeAudienceMutation.mutate({
        eventId: offerId,
        audienceType: AudienceType.EVERYONE,
      });
    }

    deleteOnlineUrl.mutate({
      eventId: offerId,
    });
  };
};

type PlaceStepProps = StackProps &
  StepProps & {
    terms: Array<Values<typeof EventTypes>>;
    chooseLabel: (t: TFunction) => string;
    placeholderLabel: (t: TFunction) => string;
  } & { offerId?: string };

const LocationStep = ({
  formState,
  getValues,
  reset,
  control,
  name,
  offerId,
  onChange,
  chooseLabel,
  placeholderLabel,
  setValue,
  watch,
  ...props
}: PlaceStepProps) => {
  const { t } = useTranslation();

  const [streetAndNumber, setStreetAndNumber] = useState('');
  const [audienceType, setAudienceType] = useState('');
  const [onlineUrl, setOnlineUrl] = useState('');
  const [hasOnlineUrlError, setHasOnlineUrlError] = useState(false);

  const [scope, locationStreetAndNumber, locationOnlineUrl, location] =
    useWatch({
      control,
      name: [
        'scope',
        'location.streetAndNumber',
        'location.onlineUrl',
        'location',
      ],
    });

  const shouldAddSpaceBelowTypeahead = useMemo(() => {
    if (offerId || location?.isOnline) return false;

    if (
      scope === OfferTypes.PLACES &&
      (!location?.municipality?.name ||
        !formState.touchedFields.location?.streetAndNumber)
    ) {
      return true;
    }

    if (
      scope === OfferTypes.EVENTS &&
      (!location?.municipality?.name || !location?.place)
    ) {
      return true;
    }

    return false;
  }, [
    formState.touchedFields.location?.streetAndNumber,
    location?.isOnline,
    location?.municipality?.name,
    location?.place,
    offerId,
    scope,
  ]);

  const useGetOfferByIdQuery =
    scope === OfferTypes.EVENTS ? useGetEventByIdQuery : useGetPlaceByIdQuery;

  const getOfferByIdQuery = useGetOfferByIdQuery({ id: offerId });

  // @ts-expect-error
  const audience = getOfferByIdQuery.data?.audience;

  useEffect(() => {
    if (audience?.audienceType) {
      setAudienceType(audience.audienceType);
    }

    if (!locationStreetAndNumber && !locationOnlineUrl) return;

    if (locationStreetAndNumber) {
      setStreetAndNumber(locationStreetAndNumber);
    }

    if (locationOnlineUrl) {
      setOnlineUrl(locationOnlineUrl);
    }
  }, [locationStreetAndNumber, locationOnlineUrl, audience]);

  const handleChangeStreetAndNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const shouldShowNextStepInCreate =
      !offerId &&
      !formState.touchedFields.location?.streetAndNumber &&
      e.target.value.trim().length >= 2;

    if (shouldShowNextStepInCreate) {
      setValue('location.streetAndNumber', undefined, {
        shouldTouch: true,
      });
    }

    setStreetAndNumber(e.target.value);
  };

  return (
    <Stack
      {...getStackProps(props)}
      minHeight={shouldAddSpaceBelowTypeahead ? '26.5rem' : 'inherit'}
    >
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const { isOnline, municipality, country } =
            field?.value as OfferFormData['location'];

          const onFieldChange = (updatedValue) => {
            updatedValue = { ...field.value, ...updatedValue };
            field.onChange(updatedValue);
            onChange(updatedValue);
            field.onBlur();
          };

          const renderFieldWithRecentLocations = (children) => (
            <Inline
              spacing={4}
              stackOn={Breakpoints.M}
              alignItems={'flex-start'}
              width={'100%'}
            >
              {!isOnline && (
                <RecentLocations flex={1} onFieldChange={onFieldChange} />
              )}
              <Stack spacing={4} flex={1}>
                {!isOnline && (
                  <Text fontWeight={'bold'}>
                    {t('create.location.recent_locations.other')}
                  </Text>
                )}
                {children}
              </Stack>
            </Inline>
          );

          const OnlineToggle = (
            <Stack marginBottom={4}>
              <FormElement
                id="online-toggle"
                Component={
                  <Inline
                    spacing={5}
                    alignItems="center"
                    maxWidth={parseSpacing(9)}
                    {...getInlineProps(props)}
                  >
                    <ToggleBox
                      onClick={() =>
                        field.onChange({ ...field.value, isOnline: false })
                      }
                      active={!isOnline}
                      icon={<PhysicalLocationIcon width={'50px'} />}
                      text={'Op een fysieke locatie'}
                      width="30%"
                      minHeight={parseSpacing(7)}
                    />
                    <ToggleBox
                      onClick={() =>
                        field.onChange({ ...field.value, isOnline: true })
                      }
                      active={isOnline}
                      icon={<OnlineLocationIcon width={'50px'} />}
                      text={t('create.location.is_online.label')}
                      width="30%"
                      minHeight={parseSpacing(7)}
                    />
                  </Inline>
                }
              />
            </Stack>
          );

          if (isOnline) {
            return (
              <Stack spacing={4}>
                {OnlineToggle}
                {renderFieldWithRecentLocations(
                  <FormElement
                    Component={
                      <Input
                        maxWidth="28rem"
                        value={onlineUrl}
                        onBlur={(e) => {
                          const prefixedUrl =
                            e.target.value === ''
                              ? e.target.value
                              : prefixUrlWithHttp(e.target.value);
                          const updatedValue = {
                            ...field?.value,
                            onlineUrl: prefixedUrl,
                          };
                          field.onChange(updatedValue);
                          if (isValidUrl(prefixedUrl)) {
                            onChange(updatedValue);
                            setHasOnlineUrlError(false);
                          } else {
                            setHasOnlineUrlError(true);
                          }
                        }}
                        onChange={(e) => {
                          setOnlineUrl(e.target.value);
                        }}
                        placeholder={t(
                          'create.location.online_url.placeholder',
                        )}
                      />
                    }
                    id="online-url"
                    label={t('create.location.online_url.label')}
                    error={
                      hasOnlineUrlError &&
                      t('create.validation_messages.location.online_url')
                    }
                    info={
                      <Text
                        variant={TextVariants.MUTED}
                        maxWidth={parseSpacing(9)}
                      >
                        {t('create.location.online_url.info')}
                      </Text>
                    }
                  />,
                )}
              </Stack>
            );
          }

          if (!country || municipality?.zip === '0000') {
            return renderFieldWithRecentLocations(
              <>
                <Inline alignItems="center" spacing={3}>
                  <Icon
                    name={Icons.CHECK_CIRCLE}
                    color={getGlobalValue('successIcon')}
                  />
                  <Text>{t('create.location.country.location_school')}</Text>
                  <Button
                    variant={ButtonVariants.LINK}
                    onClick={() => {
                      onFieldChange({
                        country: Countries.BE,
                        municipality: undefined,
                      });
                      setAudienceType(AudienceType.EVERYONE);
                    }}
                  >
                    {t('create.location.country.change_location')}
                  </Button>
                </Inline>
                <Alert maxWidth="53rem">
                  {t('create.location.country.location_school_info')}
                </Alert>
              </>,
            );
          }

          if (!municipality) {
            return (
              <>
                {scope === OfferTypes.EVENTS && OnlineToggle}
                {renderFieldWithRecentLocations(
                  <Inline spacing={1} alignItems="center">
                    <CityPicker
                      name="city-picker-location-step"
                      country={country}
                      offerId={offerId}
                      value={field.value?.municipality}
                      onChange={(value) => {
                        onFieldChange({
                          municipality: value,
                          place: undefined,
                        });
                      }}
                      width="22rem"
                    />
                    <CountryPicker
                      value={country}
                      includeLocationSchool={scope === OfferTypes.EVENTS}
                      onChange={(newCountry) =>
                        onFieldChange({ country: newCountry })
                      }
                      css={`
                        & button {
                          margin-bottom: 0.3rem;
                        }
                      `}
                    />
                    <NewFeatureTooltip
                      featureUUID={Features.GERMAN_POSTALCODES}
                    />
                  </Inline>,
                )}
              </>
            );
          }

          return renderFieldWithRecentLocations(
            <>
              <Inline alignItems="center" spacing={3}>
                <Icon
                  name={Icons.CHECK_CIRCLE}
                  color={getGlobalValue('successIcon')}
                />
                <Text>{municipality.name}</Text>
                <Button
                  variant={ButtonVariants.LINK}
                  onClick={() => {
                    onFieldChange({
                      municipality: undefined,
                      streetAndNumber: undefined,
                    });
                    setStreetAndNumber('');
                  }}
                >
                  {t(
                    `create.location.municipality.change_${country?.toLowerCase()}`,
                  )}
                </Button>
              </Inline>
              {scope === OfferTypes.EVENTS && (
                <PlaceStep
                  municipality={municipality}
                  country={country}
                  chooseLabel={chooseLabel}
                  placeholderLabel={placeholderLabel}
                  {...{
                    formState,
                    getValues,
                    reset,
                    control,
                    name,
                  }}
                  {...getStepProps(props)}
                  onFieldChange={onFieldChange}
                />
              )}
              {scope === OfferTypes.PLACES && (
                <Stack>
                  {field.value.streetAndNumber ? (
                    <Inline alignItems="center" spacing={3}>
                      <Icon
                        name={Icons.CHECK_CIRCLE}
                        color={getGlobalValue('successIcon')}
                      />
                      <Text>{field.value.streetAndNumber}</Text>
                      <Button
                        variant={ButtonVariants.LINK}
                        onClick={() => {
                          onFieldChange({
                            streetAndNumber: undefined,
                          });
                          setStreetAndNumber('');
                        }}
                      >
                        {t(`create.location.street_and_number.change`)}
                      </Button>
                    </Inline>
                  ) : (
                    <FormElement
                      Component={
                        <Input
                          value={streetAndNumber}
                          onBlur={() => onFieldChange({ streetAndNumber })}
                          onChange={handleChangeStreetAndNumber}
                        />
                      }
                      id="location-streetAndNumber"
                      label={t('location.add_modal.labels.streetAndNumber')}
                      maxWidth="28rem"
                      error={
                        formState.errors.location?.streetAndNumber &&
                        t('location.add_modal.errors.streetAndNumber')
                      }
                    />
                  )}
                </Stack>
              )}
            </>,
          );
        }}
      />
    </Stack>
  );
};

const locationStepConfiguration: StepsConfiguration<'location'> = {
  Component: LocationStep,
  name: 'location',
  shouldShowStep: ({ watch }) => !!watch('typeAndTheme')?.type?.id,
  title: ({ t, scope }) => t(`create.location.title.${scope}`),
  stepProps: {
    chooseLabel: (t) => t('create.location.place.choose_label'),
    placeholderLabel: (t) => t('create.location.place.placeholder'),
  },
  defaultValue: {
    isOnline: false,
    country: Countries.BE,
    place: undefined,
    streetAndNumber: undefined,
    municipality: undefined,
    onlineUrl: undefined,
  },
  validation: yup.lazy((value) => {
    if (value.place) {
      // a location for an event
      return yup
        .object()
        .shape({
          place: yup.object().shape({}).required(),
          country: yup.mixed<Country>().oneOf(Object.values(Countries)),
        })
        .required();
    }

    // an online location for a event
    if (value.isOnline) {
      return yup
        .object()
        .shape({
          onlineUrl: yup.string().url(),
        })
        .required();
    }

    // a cultuurkuur event
    if (!value.country) {
      return yup.object().shape({}).required();
    }

    // a location for a place
    return yup
      .object()
      .shape({
        streetAndNumber: yup.string().required(),
        country: yup.string().oneOf(Object.values(Countries)).required(),
      })
      .required();
  }),
};

LocationStep.defaultProps = {};

export { locationStepConfiguration, useEditLocation };
