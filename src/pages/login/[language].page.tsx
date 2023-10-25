/* eslint-disable react/no-unescaped-entities */
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { css, keyframes } from 'styled-components';

import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import { SupportedLanguages } from '@/i18n/index';
import { Footer } from '@/pages/Footer';
import { Box } from '@/ui/Box';
import { Button, ButtonSizes } from '@/ui/Button';
import { CustomIcon, CustomIconVariants } from '@/ui/CustomIcon';
import { Inline } from '@/ui/Inline';
import { Link } from '@/ui/Link';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import {
  Breakpoints,
  colors,
  getGlobalBorderRadius,
  getValueFromTheme,
} from '@/ui/theme';

const getValueForPage = getValueFromTheme('loginPage');
const getValueForLogo = getValueFromTheme('loginLogo');

const UDBLogo = () => {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={277}
      viewBox="0 0 172 34"
    >
      <path
        d="M19.45 19.682c0 2.284-.243 4.127-1.979 5.768-1.557 1.47-3.453 1.983-5.354 2.148-1.656.147-3.822-.108-5.22-1.098-1.922-1.397-2.29-3.47-2.29-6.104V5.836l5.642.476v13.195c0 .704-.028 1.662.34 2.296.425.657 1.267.894 1.984.86.63-.032 1.42-.276 1.894-.772.712-.715.631-1.777.631-2.729V6.715l4.353.367-.001 12.6Zm6.935-7.677-5.224-.235V7.225l5.223.44v4.34h.001Zm0 13.996-5.224.433V13.265l5.223.166v12.57h.001Zm10.41-.784-5.268.445V12.324l-3.797-.167V7.778l12.784 1.074v3.861l-3.719-.16v12.665ZM.155 0h55.794v33.83H.154l44.634-5.638V5.639L.154 0Zm74.602 25.657h-4.458v-1.628c-.66 1.254-1.748 1.88-3.265 1.88-1.399 0-2.533-.551-3.403-1.655-.87-1.105-1.306-2.709-1.306-4.812 0-1.966.438-3.528 1.312-4.685.874-1.157 2.03-1.734 3.469-1.734 1.199 0 2.188.462 2.967 1.387V9.219h4.684v16.438Zm-4.684-7.877c0-1.1-.45-1.65-1.348-1.65-.627 0-1.038.35-1.233 1.048-.194.7-.291 1.553-.291 2.566 0 1.984.5 2.975 1.502 2.975.381 0 .704-.157.97-.47.267-.314.4-.79.4-1.433V17.78Zm19.403 7.877h-4.528a8.13 8.13 0 0 1-.167-1.709c-.86 1.308-2.158 1.962-3.898 1.962-1.431 0-2.503-.37-3.214-1.108-.712-.74-1.066-1.587-1.066-2.542 0-1.294.582-2.34 1.746-3.138 1.164-.798 3.228-1.277 6.192-1.44v-.277c0-.538-.12-.894-.363-1.071-.243-.177-.6-.265-1.066-.265-1.097 0-1.708.446-1.836 1.336l-4.34-.408c.62-2.561 2.729-3.841 6.33-3.841.977 0 1.875.098 2.693.296.819.196 1.465.503 1.942.92.477.418.798.859.96 1.324.163.465.245 1.36.245 2.685v4.888c0 .934.123 1.728.37 2.387Zm-4.934-5.735c-2.025.22-3.038.873-3.038 1.965 0 .738.402 1.106 1.203 1.106.509 0 .942-.152 1.3-.456.357-.305.535-.982.535-2.025v-.59Zm14.518-6.514v3.12h-2.42v4.516c0 .617.115.985.345 1.101.231.118.469.175.715.175.382 0 .835-.068 1.36-.203v3.42c-.938.186-1.862.276-2.767.276-1.462 0-2.536-.316-3.225-.95-.686-.634-1.03-1.646-1.03-3.036l.012-1.432v-3.867H90.24V13.41h1.812l.072-3.986 4.516-.07v4.059h2.422l-.001-.004Zm13.992 12.249h-4.528a8.212 8.212 0 0 1-.167-1.709c-.857 1.308-2.157 1.962-3.897 1.962-1.431 0-2.501-.37-3.212-1.108-.712-.74-1.067-1.587-1.067-2.542 0-1.294.581-2.34 1.746-3.138s3.228-1.277 6.192-1.44v-.277c0-.538-.122-.894-.364-1.071-.243-.178-.599-.265-1.066-.265-1.098 0-1.71.446-1.835 1.336l-4.34-.408c.619-2.561 2.729-3.841 6.329-3.841.98 0 1.875.098 2.695.296.819.196 1.465.503 1.942.92.477.418.797.859.96 1.324.164.465.245 1.36.245 2.685v4.888c-.002.934.12 1.728.368 2.387h-.001Zm-4.934-5.735c-2.027.22-3.038.873-3.038 1.965 0 .738.4 1.106 1.203 1.106.507 0 .94-.152 1.297-.456.36-.305.538-.982.538-2.025v-.59Zm9.739 5.735h-2.684V9.219h4.686v5.647c.651-1.14 1.688-1.71 3.11-1.71 1.001 0 1.852.264 2.551.794.699.53 1.22 1.286 1.56 2.27.344.983.513 2.018.513 3.101 0 1.976-.436 3.57-1.311 4.775-.873 1.208-2.178 1.813-3.909 1.813-1.709 0-3.007-.647-3.898-1.94a7.665 7.665 0 0 0-.618 1.687Zm2.002-4.566c0 1.206.46 1.81 1.381 1.81.502 0 .885-.22 1.152-.658.265-.438.398-1.338.398-2.704 0-1.485-.151-2.419-.452-2.8-.303-.381-.675-.572-1.122-.572-.349 0-.663.136-.94.41-.278.274-.417.67-.417 1.192v3.322Zm21.846 4.566h-4.53a8.21 8.21 0 0 1-.168-1.709c-.857 1.308-2.154 1.962-3.895 1.962-1.431 0-2.503-.37-3.212-1.108-.712-.74-1.067-1.587-1.067-2.542 0-1.294.582-2.34 1.746-3.138 1.164-.798 3.229-1.277 6.192-1.44v-.277c0-.538-.123-.894-.365-1.071-.241-.178-.597-.265-1.067-.265-1.096 0-1.707.446-1.835 1.336l-4.338-.408c.62-2.561 2.729-3.841 6.328-3.841.979 0 1.875.098 2.695.296.819.196 1.465.503 1.942.92.477.418.797.859.96 1.324.162.465.243 1.36.243 2.685v4.888c0 .934.124 1.729.371 2.388Zm-4.934-5.735c-2.026.22-3.041.873-3.041 1.965 0 .738.402 1.106 1.204 1.106.509 0 .943-.152 1.3-.456.356-.305.536-.982.536-2.025l.001-.59Zm18.866 5.735h-4.755v-7.709c0-.634-.098-1.04-.293-1.216a1.052 1.052 0 0 0-.733-.264c-.866 0-1.299.61-1.299 1.83v7.359h-4.756V13.41h4.411v1.734c.651-1.325 1.815-1.988 3.491-1.988.884 0 1.627.17 2.235.511.611.34 1.044.782 1.305 1.324.263.541.394 1.482.394 2.825v7.84Zm15.031-12.249-3.665 4.208 4.081 8.04h-4.915l-2.275-4.906-1.298 1.533v3.373h-4.456V9.219h4.458v6.634c0 .186-.012.923-.033 2.216.284-.41.575-.783.868-1.12l3.044-3.54h4.191Z"
        fill="#009FDF"
      />
    </svg>
  );
};

const ManIllustrationSvg = () => {
  return (
    <Stack
      css={`
        z-index: 1;
      `}
    >
      <svg
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="422"
        viewBox="0 0 425 314"
      >
        <path
          d="m297.207 51.24-28.911 37.275c-2.852 3.645-7.249 5.87-11.88 5.96l-30.014.773 3.182-28.73 25.358.52 31.275-35.188c3.694-4.09 9.731-4.985 14.392-2.02l8.867 5.552"
          fill="white"
          stroke="#009FDF"
          stroke-width="1.851"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m400.358 109.371-92.285 25.975-25.975-92.285 8.288-2.33 7.752 5.714a7.546 7.546 0 0 0 10.018-.905 7.606 7.606 0 0 0 .39-9.992l65.744-18.464 26.068 92.287Z"
          fill="#9EC7DB"
          stroke="#9EC7DB"
          stroke-width="1.851"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m374.891 48.076-76.99 21.651 2.255 8.02 76.991-21.65-2.256-8.02Z"
          stroke="#fff"
          stroke-width="1.851"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m324.2 62.256-15.367 4.407 16.379-17.626 6.435-6.812 8.93 2.498 23.198 6.494-15.365 4.314-24.21 6.725ZM312.59 74.18l-8.02 2.256 12.204 43.396 8.02-2.255L312.59 74.18Z"
          stroke="#fff"
          stroke-width="1.851"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m312.346 121.083 2.226-9.213 2.243 8.008-4.469 1.205ZM334.329 106.324l-11.851 3.332 2.255 8.02 11.851-3.333-2.255-8.019ZM354.879 100.521l-12.475 3.508 2.255 8.02 12.476-3.508-2.256-8.02ZM374.657 95.01l-11.852 3.333 2.255 8.02 11.852-3.333-2.255-8.02ZM389.359 99.424l-4.471 1.297-2.243-8.009 6.714 6.712ZM332.42 68.58l-8.02 2.255 12.204 43.396 8.02-2.256-12.204-43.396Z"
          stroke="#fff"
          stroke-width="1.851"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m372.749 57.267-8.02 2.256 12.203 43.396 8.02-2.256-12.203-43.396ZM352.829 62.893l-8.019 2.255 12.203 43.396 8.02-2.255-12.204-43.396ZM352.734 93.025l-12.48 3.54M372.57 87.413l-11.92 3.367M332.246 98.808l-11.825 3.275"
          stroke="#fff"
          stroke-width="1.851"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m305.452 32.892 1.914 1.521c.455.38.908.852 1.269 1.322a7.606 7.606 0 0 1-.39 9.992c-2.649 2.723-6.917 3.19-10.018.905l-7.753-5.714M254.941 67.039l1.421 7.436"
          stroke="#009FDF"
          stroke-width="1.851"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M86.16 69.865a4.402 4.402 0 0 0 .926 4.906l7.22 7.498 8.332 8.609-.278 3.24-8.98-.648-74.7-5.647 5.647-74.978.648-8.702 83.679 6.295-4.628 60.723-8.794-2.777-3.702-1.11c-2.13-.648-4.444.462-5.37 2.591Z"
          stroke="#9EC7DB"
          stroke-width="1.851"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M86.16 69.866a4.402 4.402 0 0 0 .927 4.906l7.22 7.498-.833 11.293-.648 8.701-83.68-6.294 6.294-83.68 8.98.648 74.7 5.646-3.795 49.986-3.703-1.11c-2.221-.834-4.535.277-5.461 2.406Z"
          stroke="#9EC7DB"
          stroke-width="1.851"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m90.974 26.545-3.147 41.377c-.74.463-1.296 1.11-1.666 2.036a4.402 4.402 0 0 0 .925 4.906l.278.278-2.684 35.175L1 104.023l6.294-83.68 83.68 6.202Z"
          fill="#9EC7DB"
          stroke="#9EC7DB"
          stroke-width="1.851"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m163.453 112.446-14.625 26.289c-6.295 7.405-18.05 6.016-22.586-2.592L102.73 90.971l-.092-.093-8.331-8.609-6.943-7.22-.278-.278c-1.296-1.295-1.573-3.24-.925-4.906.37-.833.925-1.573 1.666-2.036 1.11-.74 2.5-.926 3.795-.555l3.703 1.11 8.794 2.777.648-8.145 30.176 47.579 7.59-11.016 20.92 12.867ZM134.943 110.78l-4.258 7.405"
          fill="white"
          stroke="#009FDF"
          stroke-width="1.851"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M70.517 77.826c-.092 4.166-3.517 7.498-7.683 7.59.093-2.498-1.203-4.627-2.962-4.813-1.944-.185-3.702 1.76-4.073 4.536l-6.48-.37c.186-2.592-1.11-4.814-2.961-4.999-1.944-.185-3.796 1.852-4.073 4.629l-6.11-.37v-.278c.278-2.777-1.018-5.184-2.962-5.37-1.944-.184-3.795 1.852-4.073 4.63v.74l-4.72-.278 5.738-42.766 24.068 1.296-2.592 17.588 15.829 11.94c1.944 1.297 3.147 3.703 3.054 6.295Z"
          stroke="#fff"
          stroke-width="1.851"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M36.176 83.658v.278c-.37 2.592-2.129 4.443-3.98 4.258-1.759-.185-3.055-2.222-2.962-4.628v-.74c.277-2.778 2.129-4.814 4.073-4.63 1.85.279 3.147 2.685 2.87 5.462ZM49.32 84.676v.37c-.278 2.777-2.129 4.814-4.073 4.629-1.944-.185-3.24-2.592-2.962-5.369.278-2.777 2.129-4.813 4.073-4.628 1.851.185 3.147 2.406 2.962 4.998ZM62.835 85.417v.462c-.278 2.777-2.13 4.814-4.073 4.629-1.944-.185-3.24-2.592-2.962-5.369v-.093c.37-2.684 2.129-4.72 4.073-4.535 1.758.277 3.054 2.406 2.962 4.906ZM52.837 50.982l-7.775-.555M51.542 59.313l-7.498-.37M52.004 59.498l15.274-8.516c2.406-1.388 3.054-4.628 1.203-6.757-1.944-2.314-5.554-2.037-7.22.463l-9.257 14.81Z"
          stroke="#fff"
          stroke-width="1.851"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M232.508 288.692h-30.084l-13.422-119.781-11.201 119.781h-32.12l17.773-147.18h52.577l16.477 147.18Z"
          stroke="#009FDF"
          stroke-width="1.851"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M245.282 95.414h-24.53v50.078c-38.878 9.164-60.723 0-60.723 0v-27.307c-12.96-2.962-20.18-17.865-20.18-17.865l12.311-22.864c2.5-4.72 6.665-8.238 11.664-9.997l16.384-5.739c0 2.777 1.111 5.276 2.869 7.128 1.759 1.85 4.258 3.054 6.943 3.147 6.109.277 11.108-4.721 10.83-10.923l43.414 5.461c8.053 16.662 1.018 28.881 1.018 28.881Z"
          fill="#009FDF"
        />
        <path
          d="M245.282 95.414h-24.53v50.078c-38.878 9.164-60.723 0-60.723 0v-27.307c-12.96-2.962-20.18-17.865-20.18-17.865l12.311-22.864c2.5-4.72 6.665-8.238 11.664-9.997l16.384-5.739c0 2.777 1.111 5.276 2.869 7.128 1.759 1.85 4.258 3.054 6.943 3.147 6.109.277 11.108-4.721 10.83-10.923l43.414 5.461c8.053 16.662 1.018 28.881 1.018 28.881Z"
          stroke="#009FDF"
          stroke-width="1.851"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m207.7 44.595-7.683 3.703.741 12.866c.37 6.11-4.721 11.2-10.83 10.923-2.777-.092-5.184-1.296-6.943-3.147-1.759-1.851-2.869-4.35-2.869-7.128V31.451l-9.535-5.554c-1.666-1.018-2.499-2.962-1.944-4.814.556-1.85 2.222-3.147 4.166-3.147.185 0 .463 0 .648.093l12.867 1.944v-6.017l14.903-4.906 10.922 22.308c2.592 4.814.556 10.83-4.443 13.237Z"
          fill="white"
          stroke="#009FDF"
          stroke-width="1.851"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m177.801 288.692-2.314 23.974h-53.133l23.142-22.216.185-1.758h32.12ZM256.945 312.666h-51.837l-2.684-23.974h30.084l24.437 23.974ZM178.449 18.677V10.53c0-2.962 3.24-4.814 5.832-3.425l1.203.648 1.666-4.258c.926-2.407 3.796-3.24 5.925-1.759l2.314 1.666c2.684-2.221 6.757 0 6.294 3.518l-.277 2.129-14.904 4.906v6.017l-8.053-1.296Z"
          fill="#009FDF"
          stroke="#009FDF"
          stroke-width="1.851"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m396.474 27.909 7.557-16.326M402.959 32.208l14.115-11.099M405.308 39.57l17.828-2.504M205.201 169.189h13.885M160.121 169.189h12.311"
          stroke="#009FDF"
          stroke-width="1.851"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M190.946 80.788a1.481 1.481 0 1 0 0-2.962 1.481 1.481 0 0 0 0 2.962ZM190.946 91.896a1.481 1.481 0 1 0 0-2.962 1.481 1.481 0 0 0 0 2.962Z"
          fill="#fff"
          stroke="#fff"
          stroke-width="1.851"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m174.284 22.287 5.924 2.036M160.029 118.185V95.414M220.752 95.414v-8.979M202.053 18.955l2.315 4.998-.833 1.666"
          stroke="#009FDF"
          stroke-width="1.851"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M197.24 21.915a.37.37 0 1 0 0-.738.37.37 0 0 0 0 .738Z"
          fill="#009FDF"
          stroke="#009FDF"
          stroke-width="1.851"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M202.516 29.6c-.277.185-.648.37-1.018.462-1.759.37-3.517-.648-3.888-2.314"
          stroke="#009FDF"
          stroke-width="1.851"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M194.571 18.793c.868-.868 1.395-1.747 1.178-1.964-.217-.217-1.096.31-1.963 1.178-.868.868-1.395 1.747-1.178 1.964.216.217 1.096-.31 1.963-1.178ZM192.241 51.445l7.776-3.147.37 6.202-8.146-3.055Z"
          fill="#009FDF"
          stroke="#009FDF"
          stroke-width="1.851"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m148.273 294.431-13.885-20.827c-2.592-3.888-8.516-3.24-10.182 1.203-1.018 2.592.092 5.646 2.499 7.035l21.568 12.589ZM148.088 294.523l-15.551 1.204c-2.962.185-4.351 3.702-2.499 5.924 1.11 1.388 3.054 1.666 4.628.833l13.422-7.961ZM232.508 293.783l13.885-20.828c2.592-3.887 8.516-3.239 10.182 1.204 1.018 2.592-.092 5.646-2.499 7.035l-21.568 12.589ZM232.693 293.875l15.551 1.203c2.962.186 4.351 3.703 2.499 5.925-1.111 1.388-3.054 1.666-4.628.833l-13.422-7.961Z"
          stroke="#9EC7DB"
          stroke-width="1.851"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </Stack>
  );
};

const WomanIllustrationSvg = () => {
  return (
    <Stack
      css={`
        z-index: 1;
      `}
    >
      <svg
        width="377"
        height="321"
        viewBox="0 0 377 321"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M130.915 91.0246C130.902 91.115 130.89 91.2054 130.877 91.2957C130.713 92.4706 131.104 93.6308 131.894 94.5703L134.633 99.3751L130.206 131.097L36.5758 118.03L49.6306 24.4904L143.17 37.5451L136.107 88.1558C134.001 87.4012 131.436 88.6097 130.915 91.0246Z"
          fill="#9EC7DB"
          stroke="#9EC7DB"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M123.601 107.786L58.4394 98.6921L49.3114 97.4182L56.2361 47.8016L130.525 58.1698L123.601 107.786Z"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M73.9427 72.1093L80.1259 80.6196L93.5986 72.5491L114.382 106.5"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M66.5933 62.0541L56.2361 47.8016"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M126.199 89.1688L101.707 85.7506"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M74.2327 70.0304L73.1227 77.9835C72.5803 81.8697 68.9883 84.501 65.1021 83.9586C61.216 83.4163 58.4943 79.8116 59.024 76.0158L60.134 68.0627C60.6007 64.7188 63.3289 62.3355 66.5026 62.0413C67.0574 62.0266 67.6123 62.0119 68.1546 62.0876C70.0525 62.3525 71.7465 63.4181 72.8351 64.86C73.9364 66.2115 74.4976 68.1325 74.2327 70.0304Z"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M65.1025 83.9587L62.9961 99.0516"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M113.717 68.3543C113.541 69.6196 112.408 70.475 111.142 70.2984C109.877 70.1218 109.022 68.9889 109.198 67.7236C109.375 66.4584 110.508 65.603 111.773 65.7796C113.026 66.0465 113.881 67.1794 113.717 68.3543Z"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M86.6926 52.052L90.8438 46.7347L94.995 41.4173L97.5317 47.668L100.068 53.9188"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M95.5841 103.876L72.99 100.723L73.5576 96.6558C74.1378 92.4985 77.9484 89.6212 82.1057 90.2014C85.2689 90.6429 87.7027 93.0096 88.3962 95.9626C89.054 95.8701 89.8023 95.7903 90.4349 95.8786C92.1521 96.1183 93.5876 97.0557 94.5207 98.2916C95.4539 99.5274 95.9498 101.255 95.7228 102.882L95.5841 103.876Z"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M29.6039 132.996L20.1538 147.893"
          stroke="#009FDF"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M22.4389 128.219L8.31674 138.963"
          stroke="#009FDF"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M19.791 119.465L2.86309 124.565"
          stroke="#009FDF"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M163.311 106.835L161.486 119.519L154.003 128.735L135.023 107.93L135.57 102.09L135.023 98.0746L131.647 93.6945C130.734 92.9645 130.187 91.7782 130.187 90.5919C130.187 90.5006 130.187 90.4094 130.187 90.3181C130.369 87.8543 132.742 86.2118 135.023 86.7593C135.479 86.8506 135.935 87.0331 136.3 87.3068L163.311 106.835Z"
          fill="white"
          stroke="#009FDF"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M370.761 91.8378L288.202 96.2179L292.582 178.777L375.141 174.397L370.761 91.8378Z"
          stroke="#9EC7DB"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M238.32 283.864L236.404 299.742H207.203L208.39 283.864H238.32Z"
          stroke="#009FDF"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M303.931 299.742H272.631L269.62 283.864H300.92L303.292 299.012L303.931 299.742Z"
          stroke="#009FDF"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M328.843 320L276.373 319.361L272.631 299.742H303.931L328.843 320Z"
          fill="#009FDF"
          stroke="#009FDF"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M236.404 299.742L233.94 319.452L181.197 320L207.203 299.742H236.404Z"
          fill="#009FDF"
          stroke="#009FDF"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M234.123 155.199L235.4 184.673V184.764L216.237 185.951H215.69L208.39 283.864H238.32L250.731 183.943L269.62 283.864H300.919L284.859 181.479L263.232 182.939L259.035 154.286"
          f
          stroke="#009FDF"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M260.586 154.195L259.035 154.286L234.123 155.198L229.925 155.381V81.6491C230.016 82.0141 230.016 82.3791 230.108 82.6529C230.199 83.1091 230.381 83.5654 230.473 84.0217C230.564 84.2042 230.564 84.3867 230.655 84.4779C230.746 84.6604 230.746 84.8429 230.838 84.9342C230.929 85.1167 231.02 85.2992 231.111 85.3905C231.203 85.573 231.294 85.6642 231.385 85.8467C231.476 86.0292 231.568 86.1205 231.659 86.303C231.75 86.4855 231.841 86.5767 231.933 86.7592C232.024 86.9417 232.115 87.033 232.298 87.2155C232.48 87.4893 232.754 87.763 233.028 88.0368C233.119 88.128 233.21 88.2193 233.301 88.3105C233.484 88.493 233.758 88.6755 233.94 88.858C234.123 89.0405 234.396 89.1318 234.579 89.3143C234.67 89.4056 234.853 89.4968 235.035 89.588C235.126 89.6793 235.309 89.7706 235.491 89.8618C235.583 89.9531 235.674 89.9531 235.856 90.0443C237.043 90.6831 238.411 91.0481 239.78 91.2306C240.145 91.2306 240.51 91.3218 240.784 91.3218C243.795 91.3218 246.533 90.1356 248.541 88.128C250.548 86.1205 251.734 83.3829 251.734 80.3716L260.586 154.195Z"
          stroke="#009FDF"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <mask
          id="mask0_1029_919"
          maskUnits="userSpaceOnUse"
          x="148"
          y="73"
          width="90"
          height="116"
        >
          <path
            d="M237.681 73.0714H148.528V188.779H237.681V73.0714Z"
            fill="white"
          />
        </mask>
        <g mask="url(#mask0_1029_919)">
          <path
            d="M235.4 184.673L216.237 185.859H215.69L207.751 186.407L206.108 153.556C201.911 158.21 196.253 160.582 190.504 160.582C185.029 160.582 179.554 158.483 175.356 154.103L150.718 128.37C150.718 128.37 159.296 122.621 161.486 103.55L185.12 127.275L201.819 92.3256C206.291 82.9267 215.416 76.539 225.819 75.6265L229.834 75.2615V80.2803C229.834 80.7366 229.834 81.1016 229.925 81.5579L233.301 138.317L233.758 146.621L235.4 184.673Z"
            fill="#009FDF"
          />
        </g>
        <mask
          id="mask1_1029_919"
          maskUnits="userSpaceOnUse"
          x="148"
          y="73"
          width="90"
          height="116"
        >
          <path
            d="M237.681 73.0714H148.528V188.779H237.681V73.0714Z"
            fill="white"
          />
        </mask>
        <g mask="url(#mask1_1029_919)">
          <path
            d="M235.4 184.673L216.237 185.859H215.69L207.751 186.407L206.108 153.556C201.911 158.21 196.253 160.582 190.504 160.582C185.029 160.582 179.554 158.483 175.356 154.103L150.718 128.37C150.718 128.37 159.296 122.621 161.486 103.55L185.12 127.275L201.819 92.3256C206.291 82.9267 215.416 76.539 225.819 75.6265L229.834 75.2615V80.2803C229.834 80.7366 229.834 81.1016 229.925 81.5579L233.301 138.317L233.758 146.621L235.4 184.673Z"
            stroke="#009FDF"
            stroke-width="1.82504"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <mask
          id="mask2_1029_919"
          maskUnits="userSpaceOnUse"
          x="249"
          y="70"
          width="70"
          height="116"
        >
          <path
            d="M318.166 70.0602H249.453V185.22H318.166V70.0602Z"
            fill="white"
          />
        </mask>
        <g mask="url(#mask2_1029_919)">
          <path
            d="M315.885 150.453H291.43V181.114L287.597 181.388L263.324 182.939L257.94 145.708L256.845 137.039L251.826 80.3715V73.3451L261.225 72.5238C274.092 71.3375 286.32 78.729 291.247 90.683L315.885 150.453Z"
            fill="#009FDF"
          />
        </g>
        <mask
          id="mask3_1029_919"
          maskUnits="userSpaceOnUse"
          x="249"
          y="70"
          width="70"
          height="116"
        >
          <path
            d="M318.166 70.0602H249.453V185.22H318.166V70.0602Z"
            fill="white"
          />
        </mask>
        <g mask="url(#mask3_1029_919)">
          <path
            d="M315.885 150.453H291.43V181.114L287.597 181.388L263.324 182.939L257.94 145.708L256.845 137.039L251.826 80.3715V73.3451L261.225 72.5238C274.092 71.3375 286.32 78.729 291.247 90.683L315.885 150.453Z"
            stroke="#009FDF"
            stroke-width="1.82504"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <path
          d="M308.584 141.51L324.736 153.921"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M295.261 187.319L284.22 187.867L279.84 105.283L362.423 100.903L366.803 183.487L330.302 185.494"
          stroke="#9EC7DB"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M330.303 193.889C330.303 193.707 330.303 193.524 330.303 193.433C330.303 191.334 328.569 189.509 326.379 189.509C325.193 189.509 324.098 190.057 323.276 190.969L320.539 194.437H319.718L318.623 188.414C317.893 184.034 314.06 180.931 309.68 180.931C309.406 180.931 309.224 180.931 308.95 180.931C303.475 181.388 299.368 186.863 300.463 192.247L300.92 195.44L277.285 196.718L272.905 114.135L355.489 109.755L359.96 192.338L330.303 193.889Z"
          fill="#9EC7DB"
          stroke="#9EC7DB"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M332.173 151.901C338.976 143.402 340.121 133.015 334.73 128.701C329.34 124.386 319.456 127.778 312.653 136.276C305.851 144.775 304.706 155.162 310.096 159.477C315.486 163.791 325.371 160.399 332.173 151.901Z"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M332.127 178.376C334.647 178.376 336.69 176.333 336.69 173.814C336.69 171.294 334.647 169.251 332.127 169.251C329.607 169.251 327.565 171.294 327.565 173.814C327.565 176.333 329.607 178.376 332.127 178.376Z"
          fill="white"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M310.044 159.578L294.805 179.563"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M315.885 134.667L333.679 148.354"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M321.177 129.374L337.42 141.967"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M310.044 139.868L328.842 154.925"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M307.489 147.351L322.637 159.761"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M330.303 193.433C330.303 193.616 330.303 193.707 330.303 193.889C330.303 194.072 330.211 194.346 330.12 194.619L328.478 200.733C327.474 204.475 324.189 207.03 320.356 207.212L311.413 207.577C307.033 207.76 303.201 204.657 302.379 200.368L301.467 195.441L300.828 191.882C299.733 186.498 303.566 181.388 309.041 180.932C309.315 180.932 309.497 180.932 309.771 180.932C314.151 180.932 317.984 184.125 318.714 188.414L319.809 194.437L319.991 195.258L320.63 194.437L323.367 190.969C324.097 190.057 325.284 189.509 326.47 189.509C328.569 189.509 330.303 191.334 330.303 193.433Z"
          fill="white"
          stroke="#009FDF"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M223.355 117.876C224.162 117.876 224.815 117.223 224.815 116.416C224.815 115.61 224.162 114.956 223.355 114.956C222.549 114.956 221.895 115.61 221.895 116.416C221.895 117.223 222.549 117.876 223.355 117.876Z"
          fill="white"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M224.176 136.127C224.983 136.127 225.636 135.473 225.636 134.667C225.636 133.86 224.983 133.207 224.176 133.207C223.37 133.207 222.716 133.86 222.716 134.667C222.716 135.473 223.37 136.127 224.176 136.127Z"
          fill="white"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M224.998 154.377C225.804 154.377 226.458 153.723 226.458 152.917C226.458 152.111 225.804 151.457 224.998 151.457C224.191 151.457 223.538 152.111 223.538 152.917C223.538 153.723 224.191 154.377 224.998 154.377Z"
          fill="white"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M225.819 172.628C226.625 172.628 227.279 171.974 227.279 171.168C227.279 170.361 226.625 169.708 225.819 169.708C225.012 169.708 224.359 170.361 224.359 171.168C224.359 171.974 225.012 172.628 225.819 172.628Z"
          fill="white"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M260.586 41.3159C260.313 44.0535 257.94 46.061 255.111 46.061H251.644V80.2806C251.644 83.2919 250.457 86.0295 248.45 88.0371C246.442 90.0446 243.705 91.2309 240.693 91.2309C235.127 91.2309 230.473 87.0333 229.834 81.5582L229.743 80.2806V64.0377L226.184 62.3039C220.8 59.7489 218.337 53.3612 220.709 47.7948L229.743 26.3506L248.359 35.6583L255.659 35.7495C257.21 35.7495 258.67 36.4796 259.491 37.6659C260.313 38.8521 260.678 40.0384 260.586 41.3159Z"
          fill="white"
          stroke="#009FDF"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M246.624 27.5365L257.848 4.26724C259.308 1.25591 263.05 0.0696387 265.97 1.80343C269.529 3.81098 269.894 8.82985 266.7 11.3849L246.624 27.5365Z"
          fill="#009FDF"
          stroke="#009FDF"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M229.834 26.2593C230.108 31.552 237.043 34.9283 243.522 36.1146C245.164 36.3883 246.807 36.3883 248.449 36.1146L251.096 35.6583C251.096 31.0045 246.716 24.7081 241.605 25.1643L229.834 26.2593Z"
          fill="#009FDF"
          stroke="#009FDF"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M229.651 36.2057L227.37 41.1333L228.191 42.7759"
          stroke="#009FDF"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M234.396 39.1248C234.597 39.1248 234.761 38.9615 234.761 38.7602C234.761 38.5588 234.597 38.3956 234.396 38.3956C234.195 38.3956 234.031 38.5588 234.031 38.7602C234.031 38.9615 234.195 39.1248 234.396 39.1248Z"
          fill="#009FDF"
          stroke="#009FDF"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M230.929 46.1522C231.203 46.3347 231.568 46.5172 231.933 46.6085C233.667 46.9735 235.401 45.9697 235.766 44.3271"
          stroke="#009FDF"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M251.187 40.6769H256.114"
          stroke="#009FDF"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M229.834 64.1287L237.134 67.5962L229.834 69.9688V64.1287Z"
          fill="#009FDF"
          stroke="#009FDF"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M206.199 153.647L208.39 116.416"
          stroke="#009FDF"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M185.211 127.367V137.952"
          stroke="#009FDF"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M247.172 25.9855L232.663 19.9629C229.926 18.8679 229.652 15.1265 232.116 13.5752C233.576 12.6627 235.583 12.9364 236.77 14.3052L247.172 25.9855Z"
          stroke="#9EC7DB"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M247.263 25.8028L246.168 16.0388C245.986 14.2138 247.902 12.9363 249.544 13.7575C250.548 14.3051 250.913 15.4001 250.548 16.4951L247.263 25.8028Z"
          stroke="#9EC7DB"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M307.033 154.377L328.477 126.91"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M311.139 158.483L334.774 128.735"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M316.979 160.947L337.511 134.758"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M204.01 303.848L209.667 309.779"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M199.082 307.864L204.831 313.704"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M307.033 303.848L301.284 309.779"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M311.87 307.864L306.212 313.704"
          stroke="white"
          stroke-width="1.82504"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </Stack>
  );
};

const OvalSvg = () => {
  return (
    <Stack
      css={css`
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 0;
      `}
    >
      <svg
        width="100%"
        viewBox="0 0 1440 651"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1836 -41C1836 341.181 1336.57 651 720.5 651C104.426 651 -395 341.181 -395 -41C-395 -423.181 104.426 -733 720.5 -733C1336.57 -733 1836 -423.181 1836 -41Z"
          fill="url(#paint0_linear_1029_908)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1029_908"
            x1="720"
            y1="320"
            x2="720.5"
            y2="651"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#F3FBFF" stop-opacity="0" />
            <stop offset="1" stop-color="#F3FBFF" />
            <stop offset="1" stop-color="#F3FBFF" />
          </linearGradient>
        </defs>
      </svg>

      {/* <svg
        width="100%"
        viewBox="0 0 1440 643"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1835 -49C1835 333.181 1335.57 643 719.5 643C103.426 643 -396 333.181 -396 -49C-396 -431.181 103.426 -741 719.5 -741C1335.57 -741 1835 -431.181 1835 -49Z"
          fill="#F3FBFF"
        />
      </svg> */}
    </Stack>
  );
};

type USPCardProps = {
  icon: JSX.Element;
  quantity: string;
  title: string;
  text: string;
  rotateDegree?: string;
};

const USPCard = ({
  icon,
  quantity,
  title,
  text,
  rotateDegree,
  ...props
}: USPCardProps) => {
  return (
    <Stack
      borderRadius="8px"
      backgroundColor={colors.white}
      alignItems="center"
      width="300px"
      padding={5}
      spacing={3}
      css={css`
        box-shadow: 0px 4px 40px 0px #c6e0eb80;
        transform: rotate(${rotateDegree ?? 0});
      `}
      {...getStackProps(props)}
    >
      {icon}
      <Text
        color="#141515"
        fontSize="20px"
        fontWeight="bold"
        css={`
          letter-spacing: 0.05em;
        `}
      >
        {quantity} <Text color={colors.udbMainBlue}>+</Text>
      </Text>
      <Text
        textAlign="center"
        lineHeight="28px"
        fontWeight="600"
        fontSize="11px"
        css={`
          text-transform: uppercase;
          letter-spacing: 0.24em;
        `}
      >
        {title}
      </Text>
      <Text>{text}</Text>
    </Stack>
  );
};

type UDBCardProps = {
  onLogin: () => void;
} & StackProps;

const UDBCard = ({ onLogin, ...props }: UDBCardProps) => {
  const { t } = useTranslation();

  return (
    <Stack
      flex={1}
      spacing={4}
      paddingTop={5}
      paddingBottom={5}
      paddingLeft={3}
      paddingRight={3}
      backgroundColor={colors.white}
      alignItems="center"
      css={css`
        z-index: 1;
        box-shadow: 0px 4px 40px 0px #c6e0eb80;
      `}
      {...getStackProps(props)}
    >
      <Stack>
        <UDBLogo />
        <Box as="h1" display="none">
          {t('brand')}
        </Box>
      </Stack>
      <Text fontWeight="bold" fontSize="20px" color="#6A6E70">
        {t('main.lead')}
      </Text>
      <Text textAlign="center">{t('main.lead_sub')}</Text>
      <Button onClick={onLogin} size={ButtonSizes.LARGE}>
        {t('main.start')}
      </Button>
    </Stack>
  );
};

const Column = ({ value, title, children, ...props }) => (
  <Stack as="article" flex={1} spacing={4} {...props}>
    <Stack as="blockquote" alignItems="center">
      <Box as="p" fontSize="4rem" fontWeight={300} lineHeight="4rem">
        {value}
      </Box>
      <Box as="h2" fontSize="1.2rem">
        {title}
      </Box>
    </Stack>
    <Box as="p" textAlign={{ m: 'center' }}>
      {children}
    </Box>
  </Stack>
);

Column.propTypes = {
  value: PropTypes.string,
  title: PropTypes.string,
  info: PropTypes.string,
  children: PropTypes.node,
};

const useRedirectToLanguage = () => {
  const router = useRouter();
  const language = Array.isArray(router.query?.language)
    ? router.query.language[0]
    : router.query.language;
  const { i18n } = useTranslation();

  const { setCookie } = useCookiesWithOptions();

  useEffect(() => {
    if (!language) return;

    if (SupportedLanguages[language.toUpperCase()]) {
      i18n.changeLanguage(language);
      setCookie('udb-language', language);
    } else {
      router.push('/login/nl');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);
};

const ResponsiveContainer = (props) => (
  <Inline
    maxWidth={{ default: 1170, l: 970, m: 750 }}
    paddingX={{ default: 4, m: 6, s: 6 }}
    width="100%"
    {...props}
  />
);

const MainChannelLink = () => {
  const { t } = useTranslation();
  return (
    <Link
      css={`
      display: inline
      text-decoration: underline;
      color: #555;
      &:hover {
        color: #222;
      }
    `}
      href={t('main.channels_info_link_url')}
    >
      {t('main.channels_info_link_text')}
    </Link>
  );
};

const Index = () => {
  const { query, ...router } = useRouter();
  const { t, i18n } = useTranslation();
  const { publicRuntimeConfig } = getConfig();
  const { setCookie } = useCookiesWithOptions();

  const handleChangeLanguage = (language: string) => async () =>
    router.push(`/login/${language}`, undefined, { shallow: true });

  const handleClickLogin = () => {
    const { referer } = query;

    const fallbackUri = new URL(`${publicRuntimeConfig.baseUrl}/dashboard`);
    fallbackUri.searchParams.set('tab', 'events');

    const redirectUri = referer ?? fallbackUri.toString();

    setCookie('auth0.redirect_uri', redirectUri);

    window.location.assign('/api/auth/login');
  };

  useRedirectToLanguage();

  return (
    <Stack
      width="100%"
      alignItems="center"
      spacing={6}
      backgroundColor={getValueForPage('backgroundColor')}
    >
      <Stack width="100%" height="800px">
        <Inline
          width="100%"
          padding={7}
          justifyContent="space-between"
          alignItems="flex-start"
          position="relative"
        >
          <OvalSvg />
          <ManIllustrationSvg />
          <UDBCard
            borderRadius={getGlobalBorderRadius}
            onLogin={handleClickLogin}
          />
          <WomanIllustrationSvg />
          <Inline
            width="100%"
            justifyContent="center"
            padding={5}
            css={`
              z-index: 1;
              position: absolute;
              bottom: -175px;
              left: 0;
            `}
          >
            <USPCard
              icon={
                <CustomIcon
                  name={CustomIconVariants.PHYSICAL}
                  color={colors.udbMainBlue}
                  width="32"
                />
              }
              quantity="215.000"
              title={t('main.activities')}
              text="Een uitstap, sportactiviteit, kaartavong, kermis of cursus? 
              Een concert, tentoonstelling of film? "
              rotateDegree="7.34deg"
            />
            <USPCard
              icon={
                <CustomIcon
                  name={CustomIconVariants.PHONE}
                  color={colors.udbMainBlue}
                  width="32"
                />
              }
              quantity="1.000"
              title={t('main.channels')}
              text="UiTdatabank levert informatie aan meer dan 1.000 agenda’s waaronder UiTinvlaanderen."
              rotateDegree="-5.75deg"
            />
            <USPCard
              icon={
                <CustomIcon
                  name={CustomIconVariants.BADGE}
                  color={colors.udbMainBlue}
                  width="32"
                />
              }
              quantity="28.000"
              title={t('main.organizers')}
              text="Jaarlijks promoten 28.000 organisatoren hun activiteiten via UiTdatabank. In totaal bereiken ze."
              rotateDegree="4.88deg"
            />
          </Inline>
        </Inline>
      </Stack>

      <Inline width="100%" backgroundColor="#EBF7FC" justifyContent="center">
        <Footer
          isProfileLinkVisible={false}
          onChangeLanguage={handleChangeLanguage}
          wrapper={(props) => (
            <ResponsiveContainer
              justifyContent={{ default: 'space-between', xs: 'flex-start' }}
              alignItems={{ xs: 'center' }}
              stackOn={Breakpoints.XS}
              spacing={5}
              paddingY={5}
              {...props}
            />
          )}
        />
      </Inline>
    </Stack>
  );
};

export const getServerSideProps = () => ({ props: {} });

export default Index;
