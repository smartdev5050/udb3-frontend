import { useTranslation } from 'react-i18next';

import { Link } from '@/ui/Link';
import { Stack } from '@/ui/Stack';
import { colors } from '@/ui/theme';
import { Title } from '@/ui/Title';

const BrokenGuitarIllustration = ({ width }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} viewBox="0 0 506 571">
    <g transform="translate(131 1)" fill="none" fill-rule="evenodd">
      <path
        d="M132.7 277.795h63.7v247.9h-63.7v-247.9Zm-86.8 7h63.7v240.9H45.9v-240.9Z"
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        fill="#FFF"
        fill-rule="nonzero"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        fill={colors.udbMainBlue}
        fill-rule="nonzero"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m101 355.795-55.1 19.4v-40.6z"
      />
      <path
        d="M45.9 498.795h63.7v26.9H45.9v-26.9Zm155.3-444.2 22.9-38.8c.9-1.6 2.8-2.4 4.6-2h0c2.2.5 3.6 2.6 3.3 4.8l-1.7 10.9 23.7-19.6c1.5-1.2 3.6-1.2 5 .1h0c1.7 1.5 1.7 4.2.1 5.7l-9.2 8.7 13.5-6.6c1.3-.6 2.9-.4 3.9.7h0c1.5 1.6 1.2 4.2-.7 5.2l-11.6 6.6 14-2.7c1.5-.3 2.9.9 2.9 2.4h0c0 1.1-.7 2.1-1.8 2.4l-14.5 5.1 11.2-.7c1.6 0 2.9 1.4 2.8 3h0c-.1 1.2-.9 2.2-2.1 2.6l-21.7 6c-2.4.7-4.3 2.5-5 4.9l-2.5 8-22.1 10-15-16.7h0Z"
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        fill="#FFF"
        fill-rule="nonzero"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="m126.7 90.595.8-9.9 8.8-3.8c8.4-3.7 18.2-2.5 25.5 3l19.2 14.5 20.2-39.8 37.1 6.8-14 74.7c-2.7 14.7-18.3 23.1-32.1 17.3l-41-17.1 18.3 66.3 5.5 11.3H82l21.8 14.2-20.5 59-53.7-47.1c-13.7-12-18.9-31-13.3-48.4l21.4-66.2c3.2-10 10.7-18 20.4-22l25.2-10.3 43.4-2.5"
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        fill={colors.udbMainBlue}
        fill-rule="nonzero"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M233.1 227.095c0 28.4-18.9 52.3-44.8 60-7.6 2.2-13.4 8.3-15 16.1-7.2 34.5-37.8 60.3-74.5 60.3-40.9-.1-74.7-33.2-75.7-74-1-42.7 33.3-77.7 75.9-77.7h.2c6.1 0 11.5-3.6 13.9-9.2 9.6-22.3 31.7-37.8 57.5-37.8 34.5-.3 62.5 27.7 62.5 62.3h0Z"
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        fill="#9EC7DB"
        fill-rule="nonzero"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        fill={colors.udbMainBlue}
        fill-rule="nonzero"
        stroke-linecap="round"
        stroke-linejoin="round"
        cx="150.3"
        cy="244.995"
        r="33.7"
      />
      <path
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        fill="#FFF"
        fill-rule="nonzero"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m151.251 225.547 163.514-124.635 17.944 23.541-163.514 124.635z"
      />
      <circle
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        fill="#FFF"
        fill-rule="nonzero"
        stroke-linecap="round"
        stroke-linejoin="round"
        cx="150.3"
        cy="244.995"
        r="22.2"
      />
      <path
        d="m321 124.995-9.6-12.5c-3-3.9-2.7-9.1.5-12l33.7-30.3c1.6-1.4 3.8-1.9 6-1.4l17.5 4.2c3.4.8 5.8 4.1 5.7 7.5l-.6 17.9c-.1 2.3-1.2 4.3-3 5.4l-38.5 24c-3.7 2.3-8.8 1.1-11.7-2.8h0Z"
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        fill={colors.udbMainBlue}
        fill-rule="nonzero"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="m69.5 294.495 207.9-158.5c10.1-7.7 13.7-21.5 8.2-32.9-2.3-4.6-5.8-8.3-11.3-8.8-17-1.8-20.5 14.2-10.6 15.2s15.9-23.4-9.2-27.3m-183 216.7 241.7-184.1m-239 188.2 241.9-184.4m-238.8 188 188.2-143.4c15.2-11.6 35.1-15.6 53.4-10.1 5.2 1.6 11.4 4 13.9 9.2 2.2 4.5.5 10.5-3.6 13.2-1.8 1.2-4.1 1.7-6 .9-2.5-1.2-3.4-4.8-1.9-7.2 2.8-4.4 8.4-2.4 11.3.6 3 3.1 5.2 7.6 5.9 11.8"
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="m81.1 309.795 153.4-116.9c15.4-11.7 34.6-17.6 53.8-15.6 12 1.2 24.7 4.9 28.1 16 3.2 10.6-4.3 21.3-15.7 20.5-1.4-.1-2.9-.4-4.1-1.2-1.8-1.3-2.7-3.6-2.5-5.8.4-3.8 3.9-7 7.9-5.8 9.5 2.8 17.6 17.5 10.4 25.9"
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="m350.1 76.295 5.1 1.3c2.7.7 3.4 4.2 1.2 5.9l-34.7 25.5c-1.5 1.1-3.5.8-4.6-.7h0c-1-1.4-.8-3.3.4-4.4l29.6-26.7c.8-.9 1.9-1.2 3-.9h0Zm16.2 20.4.3-5.2c.2-2.8-3-4.5-5.3-2.9l-34.7 25.5c-1.5 1.1-1.8 3.1-.7 4.6h0c1 1.4 2.9 1.8 4.4.9l34.4-20.2c.9-.6 1.5-1.6 1.6-2.7h0Z"
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        fill="#9EC7DB"
        fill-rule="nonzero"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M89.6 320.795h0c2.3-1.8 2.8-5.1 1-7.4l-22.1-29c-1.8-2.3-5.1-2.8-7.4-1h0c-2.3 1.8-2.8 5.1-1 7.4l22.1 29c1.8 2.3 5.1 2.8 7.4 1h0Zm-6-48.1 57.7 20.5c1.9.7 4-.3 4.7-2.3h0c.6-1.7-.2-3.6-1.9-4.4l-1.7-.8 9.2 1c1.7.2 3.4-.9 3.9-2.6h0c.5-1.8-.4-3.7-2.2-4.4l-2.8-1h4.8c1.4 0 2.7-.9 3.2-2.3h0c.5-1.5-.2-3.2-1.6-4l-3.3-1.7 2.6-.4c1.3-.2 2.4-1.2 2.7-2.6h0c.3-1.4-.3-2.8-1.5-3.6l-54.4-33.5-19.4 42.1h0Z"
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        fill="#FFF"
        fill-rule="nonzero"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16.3 191.595c-5.6 17.3-.4 36.3 13.3 48.4l53.7 47.1 20.5-58.8-21.8-14.3-15.9-11.3-10.4 4.2"
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        fill={colors.udbMainBlue}
        fill-rule="nonzero"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="m153.3 270.695-18.3-6.7m15.3 14.7-18-4.9m10.1 11.9-13-4.9m-39.6-143-23.7 64.8"
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        fill="#FFF"
        fill-rule="nonzero"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m116.7 341.695-5.3.1-1.5 5.1-2.7-4.5-5.1 1.2 2.6-4.6-3.7-3.8 5.3-.1 1.5-5 2.7 4.5 5.1-1.3-2.5 4.6zM81.1 338.295l4.6-3.2c3.4-1.7 6.8 2.3 4.7 5.4l-9.2 9.6h0l-9.4-9.6c-2.1-3.1 1.3-7 4.7-5.4l4.6 3.2h0Z"
      />
      <circle
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        fill="#FFF"
        fill-rule="nonzero"
        stroke-linecap="round"
        stroke-linejoin="round"
        cx="61.9"
        cy="323.995"
        r="4.7"
      />
      <path
        d="m151.2 136.295-3.3-14.4m33.1-27.5 8.4 6.6"
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        fill={colors.udbMainBlue}
        fill-rule="nonzero"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M109.6 568.495v-42.7H45.9L0 568.495z"
      />
      <path
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        fill="#FFF"
        fill-rule="nonzero"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M132.7 498.795h63.7v26.9h-63.7z"
      />
      <path
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        fill={colors.udbMainBlue}
        fill-rule="nonzero"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M132.7 568.495v-42.7h63.7l45.8 42.7z"
      />
      <path
        d="M159.4 24.995c0 3.1-2 5.9-5.1 6.9l-9.9 2.9v1c.3 30.7-17.7 28.8-17.7 28.8v26c-18 21.7-43.4 2.5-43.4 2.5l12.7-52.4-11.6-2.8c-1.9-.5-3.5-1.5-4.6-3-1.1-1.4-1.8-3.2-1.8-5.2 0-5.2 4.6-9.1 9.7-8.3l5.8.9.4.1v-.3c0-6.4 1.6-11 3.9-14.3.4-.6.9-1.2 1.4-1.7 2.6-2.8 5.8-4.3 8.8-5.2 6.6-1.9 13.7-.7 19.7 2.9 4.9 3 10.7 8.1 14 16.7l8.5-2.5c3.8-1.1 7.8 1.1 8.9 4.9.2.8.3 1.5.3 2.1h0Z"
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        fill="#FFF"
        fill-rule="nonzero"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M106.8 18.095c0 .6-.1 1.1-.2 1.7-1 3.7-5.1 5.8-8.6 4.3l-4.3-1.7.4.1v-.3c0-6.4 1.6-11 3.9-14.3l6.5 5.2c1.4 1.2 2.3 3.1 2.3 5h0Z"
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        fill="#9EC7DB"
        fill-rule="nonzero"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="m85.5 28.995 11 2.6m48-4.9 8.7-2.2m-42.5 29.1s5.9 10 16.1 11m1.4-11.4v2.7m8.7-7.7v2.7m-18.9-3.1v2.7"
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle
        fill={colors.udbMainBlue}
        fill-rule="nonzero"
        cx="120.5"
        cy="27.195"
        r="1.2"
      />
      <circle
        fill={colors.udbMainBlue}
        fill-rule="nonzero"
        cx="122.9"
        cy="38.695"
        r="1.9"
      />
      <circle
        fill={colors.udbMainBlue}
        fill-rule="nonzero"
        cx="134.2"
        cy="25.895"
        r="1.2"
      />
      <ellipse
        fill={colors.udbMainBlue}
        fill-rule="nonzero"
        transform="rotate(-35.931 116.164 24.31)"
        cx="116.164"
        cy="24.31"
        rx="4"
        ry="2"
      />
      <ellipse
        fill={colors.udbMainBlue}
        fill-rule="nonzero"
        transform="rotate(-85.175 134.16 21.376)"
        cx="134.16"
        cy="21.376"
        rx="2"
        ry="4"
      />
      <circle fill="#FFF" fill-rule="nonzero" cx="111.6" cy="34.995" r="3.4" />
      <path
        fill={colors.udbMainBlue}
        fill-rule="nonzero"
        d="m117.4 60.795 9.1 16.6-.2-12.1z"
      />
      <path
        stroke={colors.udbMainBlue}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m125.6 22.595 3.9 10.3-2 1.5"
      />
    </g>
  </svg>
);

const PageNotFound = () => {
  const { t } = useTranslation();

  return (
    <Stack
      textAlign="center"
      alignItems="center"
      justifyContent="center"
      spacing={3}
      flex={1}
      height="100vh"
    >
      <Stack marginBottom="1rem">
        <BrokenGuitarIllustration width={350} />
      </Stack>
      <Title size={1}>{t('404.title')}</Title>
      <Title size={2}>{t('404.sub_title')}</Title>
      <Link href="/dashboard" width="max-content">
        {t('404.redirect')}
      </Link>
    </Stack>
  );
};

export default PageNotFound;
