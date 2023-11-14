import { getStackProps, Stack, StackProps } from '@/ui/Stack';

type Props = {
  width: string;
} & StackProps;

const WomanIllustrationSvg = ({ width, ...props }: Props) => {
  return (
    <Stack width={width} {...getStackProps(props)}>
      <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 461 321">
        <path
          d="m214.915 91.025-.038.27c-.164 1.176.227 2.336 1.017 3.275l2.739 4.805-4.427 31.722-93.63-13.067 13.055-93.54 93.539 13.055-7.063 50.61c-2.106-.754-4.671.455-5.192 2.87Z"
          fill="#9EC7DB"
          stroke="#9EC7DB"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m207.601 107.786-65.162-9.094-9.128-1.274 6.925-49.616 74.289 10.368-6.924 49.616Z"
          stroke="#fff"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m157.943 72.11 6.183 8.51 13.473-8.07 20.783 33.95M150.593 62.054l-10.357-14.252M210.199 89.169l-24.492-3.418M158.233 70.03l-1.11 7.954c-.543 3.886-4.135 6.517-8.021 5.975-3.886-.543-6.608-4.147-6.078-7.943l1.11-7.953c.467-3.344 3.195-5.727 6.369-6.022.554-.014 1.109-.03 1.652.047 1.897.264 3.591 1.33 4.68 2.772 1.101 1.352 1.663 3.272 1.398 5.17ZM149.103 83.959l-2.107 15.093M197.717 68.354a2.259 2.259 0 0 1-2.575 1.944 2.26 2.26 0 0 1-1.944-2.574 2.26 2.26 0 0 1 2.575-1.944c1.253.266 2.108 1.4 1.944 2.574ZM170.693 52.052l4.151-5.317 4.151-5.318 2.537 6.251 2.536 6.25M179.584 103.876l-22.594-3.153.568-4.067a7.555 7.555 0 0 1 8.548-6.455c3.163.442 5.597 2.809 6.29 5.762.658-.093 1.406-.173 2.039-.084a6.206 6.206 0 0 1 4.086 2.413c.933 1.235 1.429 2.963 1.202 4.59l-.139.994Z"
          stroke="#fff"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m113.604 132.996-9.45 14.897M106.439 128.219l-14.122 10.744M103.791 119.465l-16.928 5.1"
          stroke="#009FDF"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m247.311 106.835-1.825 12.684-7.483 9.216-18.98-20.805.547-5.84-.547-4.015-3.376-4.38c-.913-.73-1.46-1.917-1.46-3.103v-.274c.182-2.464 2.555-4.106 4.836-3.559a3.2 3.2 0 0 1 1.277.548l27.011 19.528Z"
          fill="#fff"
          stroke="#009FDF"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m454.761 91.838-82.559 4.38 4.38 82.559 82.559-4.38-4.38-82.56Z"
          stroke="#9EC7DB"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m322.32 283.864-1.916 15.878h-29.201l1.187-15.878h29.93ZM387.931 299.742h-31.3l-3.011-15.878h31.3l2.372 15.148.639.73Z"
          stroke="#009FDF"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m412.843 320-52.47-.639-3.742-19.619h31.3L412.843 320ZM320.404 299.742l-2.464 19.71-52.743.548 26.006-20.258h29.201Z"
          fill="#009FDF"
          stroke="#009FDF"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m318.123 155.199 1.277 29.474v.091l-19.163 1.187h-.547l-7.3 97.913h29.93l12.411-99.921 18.889 99.921h31.299l-16.06-102.385-21.627 1.46-4.197-28.653"
          stroke="#009FDF"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m344.586 154.195-1.551.091-24.912.912-4.198.183V81.649c.091.365.091.73.183 1.004.091.456.273.912.365 1.369.091.182.091.365.182.456.091.182.091.365.183.456.091.183.182.365.273.457.092.182.183.273.274.456.091.182.183.274.274.456.091.183.182.274.274.456.091.183.182.274.365.457.182.273.456.547.73.82l.273.275c.183.182.457.364.639.547.183.182.456.274.639.456.091.092.274.183.456.274.091.091.274.183.456.274.092.091.183.091.365.182 1.187.64 2.555 1.004 3.924 1.187.365 0 .73.09 1.004.09 3.011 0 5.749-1.185 7.757-3.193a10.897 10.897 0 0 0 3.193-7.756l8.852 73.823Z"
          stroke="#009FDF"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <mask
          id="a"
          maskUnits="userSpaceOnUse"
          x="232"
          y="73"
          width="90"
          height="116"
        >
          <path d="M321.681 73.071h-89.153V188.78h89.153V73.071Z" fill="#fff" />
        </mask>
        <g mask="url(#a)">
          <path
            d="m319.4 184.673-19.163 1.186h-.547l-7.939.548-1.643-32.851c-4.197 4.654-9.855 7.026-15.604 7.026-5.475 0-10.95-2.099-15.148-6.479l-24.638-25.733s8.578-5.749 10.768-24.82l23.634 23.725 16.699-34.95c4.472-9.398 13.597-15.786 24-16.699l4.015-.365v5.02c0 .456 0 .82.091 1.277l3.376 56.759.457 8.304 1.642 38.052Z"
            fill="#009FDF"
          />
        </g>
        <mask
          id="b"
          maskUnits="userSpaceOnUse"
          x="232"
          y="73"
          width="90"
          height="116"
        >
          <path d="M321.681 73.071h-89.153V188.78h89.153V73.071Z" fill="#fff" />
        </mask>
        <g mask="url(#b)">
          <path
            d="m319.4 184.673-19.163 1.186h-.547l-7.939.548-1.643-32.851c-4.197 4.654-9.855 7.026-15.604 7.026-5.475 0-10.95-2.099-15.148-6.479l-24.638-25.733s8.578-5.749 10.768-24.82l23.634 23.725 16.699-34.95c4.472-9.398 13.597-15.786 24-16.699l4.015-.365v5.02c0 .456 0 .82.091 1.277l3.376 56.759.457 8.304 1.642 38.052Z"
            stroke="#009FDF"
            stroke-width="1.825"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <mask
          id="c"
          maskUnits="userSpaceOnUse"
          x="333"
          y="70"
          width="70"
          height="116"
        >
          <path d="M402.166 70.06h-68.713v115.16h68.713V70.06Z" fill="#fff" />
        </mask>
        <g mask="url(#c)">
          <path
            d="M399.885 150.453H375.43v30.661l-3.833.274-24.273 1.551-5.384-37.231-1.095-8.669-5.019-56.667v-7.027l9.399-.821c12.867-1.186 25.095 6.205 30.022 18.159l24.638 59.77Z"
            fill="#009FDF"
          />
        </g>
        <mask
          id="d"
          maskUnits="userSpaceOnUse"
          x="333"
          y="70"
          width="70"
          height="116"
        >
          <path d="M402.166 70.06h-68.713v115.16h68.713V70.06Z" fill="#fff" />
        </mask>
        <g mask="url(#d)">
          <path
            d="M399.885 150.453H375.43v30.661l-3.833.274-24.273 1.551-5.384-37.231-1.095-8.669-5.019-56.667v-7.027l9.399-.821c12.867-1.186 25.095 6.205 30.022 18.159l24.638 59.77Z"
            stroke="#009FDF"
            stroke-width="1.825"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <path
          d="m392.584 141.51 16.152 12.411"
          stroke="#fff"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m379.261 187.319-11.041.548-4.38-82.584 82.583-4.38 4.38 82.584-36.501 2.007"
          stroke="#9EC7DB"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M414.303 193.889v-.456c0-2.099-1.734-3.924-3.924-3.924-1.186 0-2.281.548-3.103 1.46l-2.737 3.468h-.821l-1.095-6.023c-.73-4.38-4.563-7.483-8.943-7.483h-.73c-5.475.457-9.582 5.932-8.487 11.316l.457 3.193-23.635 1.278-4.38-82.583 82.584-4.38 4.471 82.583-29.657 1.551Z"
          fill="#9EC7DB"
          stroke="#9EC7DB"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M416.173 151.901c6.803-8.499 7.948-18.886 2.557-23.2-5.39-4.315-15.274-.923-22.077 7.575-6.802 8.499-7.947 18.886-2.557 23.201 5.39 4.314 15.275.922 22.077-7.576Z"
          stroke="#fff"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M416.127 178.376a4.563 4.563 0 1 0 0-9.126 4.563 4.563 0 0 0 0 9.126Z"
          fill="#fff"
          stroke="#fff"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m394.044 159.578-15.239 19.985M399.885 134.667l17.794 13.687M405.177 129.374l16.243 12.593M394.044 139.868l18.798 15.057M391.489 147.351l15.148 12.41"
          stroke="#fff"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M414.303 193.433v.456c0 .183-.092.457-.183.73l-1.642 6.114c-1.004 3.742-4.289 6.297-8.122 6.479l-8.943.365c-4.38.183-8.212-2.92-9.034-7.209l-.912-4.927-.639-3.559a9.144 9.144 0 0 1 8.213-10.95h.73c4.38 0 8.213 3.193 8.943 7.482l1.095 6.023.182.821.639-.821 2.737-3.468c.73-.912 1.917-1.46 3.103-1.46 2.099 0 3.833 1.825 3.833 3.924Z"
          stroke="#009FDF"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M307.355 117.876a1.46 1.46 0 1 0 .002-2.918 1.46 1.46 0 0 0-.002 2.918ZM308.176 136.127a1.46 1.46 0 1 0 0-2.92 1.46 1.46 0 0 0 0 2.92ZM308.998 154.377a1.46 1.46 0 1 0 0-2.92 1.46 1.46 0 0 0 0 2.92ZM309.819 172.628a1.46 1.46 0 1 0 0-2.92 1.46 1.46 0 0 0 0 2.92Z"
          fill="#fff"
          stroke="#fff"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M344.586 41.316c-.273 2.737-2.646 4.745-5.475 4.745h-3.467v34.22c0 3.01-1.187 5.748-3.194 7.756a10.896 10.896 0 0 1-7.757 3.194c-5.566 0-10.22-4.198-10.859-9.673l-.091-1.277V64.038l-3.559-1.734c-5.384-2.555-7.847-8.943-5.475-14.51l9.034-21.443 18.616 9.307 7.3.091c1.551 0 3.011.73 3.832 1.917.822 1.186 1.187 2.372 1.095 3.65Z"
          stroke="#009FDF"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m330.624 27.537 11.224-23.27c1.46-3.011 5.202-4.197 8.122-2.464 3.559 2.008 3.924 7.027.73 9.582l-20.076 16.152Z"
          fill="#009FDF"
          stroke="#009FDF"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M313.834 26.26c.274 5.292 7.209 8.668 13.688 9.855 1.642.273 3.285.273 4.927 0l2.647-.457c0-4.654-4.38-10.95-9.491-10.494l-11.771 1.095Z"
          fill="#009FDF"
          stroke="#009FDF"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m313.651 36.206-2.281 4.927.821 1.643"
          stroke="#009FDF"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M318.396 39.125a.365.365 0 1 0 0-.73.365.365 0 0 0 0 .73Z"
          fill="#009FDF"
          stroke="#009FDF"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M314.929 46.152c.274.183.639.365 1.004.456 1.734.366 3.468-.638 3.833-2.28M335.187 40.677h4.927"
          stroke="#009FDF"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m313.834 64.129 7.3 3.467-7.3 2.373v-5.84Z"
          fill="#009FDF"
          stroke="#009FDF"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m290.199 153.647 2.191-37.231M269.211 127.367v10.585"
          stroke="#009FDF"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m331.172 25.985-14.509-6.022c-2.737-1.095-3.011-4.837-.547-6.388 1.46-.912 3.467-.639 4.654.73l10.402 11.68ZM331.263 25.803l-1.095-9.764c-.182-1.825 1.734-3.103 3.376-2.282 1.004.548 1.369 1.643 1.004 2.738l-3.285 9.308Z"
          stroke="#9EC7DB"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m391.033 154.377 21.444-27.467M395.139 158.483l23.635-29.748M400.979 160.947l20.532-26.189M288.01 303.848l5.657 5.931M283.082 307.864l5.749 5.84M391.033 303.848l-5.749 5.931M395.87 307.864l-5.658 5.84"
          stroke="#fff"
          stroke-width="1.825"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="m8.174 57.493-6.312 9.914 9.914 6.312"
          stroke="#009FDF"
          stroke-width="1.77"
          stroke-linecap="round"
        />
        <path
          d="M106.5 67.186C74 53 49.104 66.953 43.142 74.48c-9.762 12.947-1.524 19.669 3.35 18.8 7.52-1.34 5.887-11.107 3.127-16.721-7.664-15.59-35.412-12.63-47.643-9.373"
          stroke="#009FDF"
          stroke-width="1.77"
        />
      </svg>
    </Stack>
  );
};

export { WomanIllustrationSvg };
