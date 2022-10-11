import { Countries, Country } from '@/types/Country';
import { Box, BoxProps, getBoxProps } from '@/ui/Box';

const FlagBelgium = ({ ...props }: BoxProps) => {
  return (
    <Box
      as="svg"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      {...getBoxProps(props)}
    >
      <path
        d="m345.043 15.923c-27.733-10.29-57.729-15.923-89.043-15.923s-61.31 5.633-89.043 15.923l-22.261 240.077 22.261 240.077c27.733 10.291 57.729 15.923 89.043 15.923s61.31-5.632 89.043-15.923l22.261-240.077z"
        fill="#ffda44"
      />
      <path
        d="m512 256c0-110.07-69.472-203.906-166.957-240.076v480.155c97.485-36.173 166.957-130.007 166.957-240.079z"
        fill="#d80027"
      />
      <path d="m0 256c0 110.072 69.472 203.906 166.957 240.078v-480.154c-97.485 36.17-166.957 130.006-166.957 240.076z" />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
    </Box>
  );
};

const FlagNetherlands = ({ ...props }: BoxProps) => {
  return (
    <Box
      as="svg"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      {...getBoxProps(props)}
    >
      <circle cx="256" cy="256" fill="#f0f0f0" r="256" />
      <path
        d="m256 0c-110.071 0-203.906 69.472-240.077 166.957h480.155c-36.172-97.485-130.007-166.957-240.078-166.957z"
        fill="#a2001d"
      />
      <path
        d="m256 512c110.071 0 203.906-69.472 240.077-166.957h-480.154c36.171 97.485 130.006 166.957 240.077 166.957z"
        fill="#0052b4"
      />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
    </Box>
  );
};

const FlagGermany = ({ ...props }: BoxProps) => {
  return (
    <Box
      as="svg"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      {...getBoxProps(props)}
    >
      <path
        d="m15.923 345.043c36.171 97.484 130.006 166.957 240.077 166.957s203.906-69.473 240.077-166.957l-240.077-22.26z"
        fill="#ffda44"
      />
      <path d="m256 0c-110.071 0-203.906 69.472-240.077 166.957l240.077 22.26 240.077-22.261c-36.171-97.484-130.006-166.956-240.077-166.956z" />
      <path
        d="m15.923 166.957c-10.29 27.733-15.923 57.729-15.923 89.043s5.633 61.31 15.923 89.043h480.155c10.29-27.733 15.922-57.729 15.922-89.043s-5.632-61.31-15.923-89.043z"
        fill="#d80027"
      />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
    </Box>
  );
};

type Props = {
  country: Country;
} & BoxProps;

const FlagIcon = ({ country, ...props }: Props) => {
  if (country === Countries.BE) {
    return <FlagBelgium {...getBoxProps(props)} />;
  }

  if (country === Countries.NL) {
    return <FlagNetherlands {...getBoxProps(props)} />;
  }

  if (country === Countries.DE) {
    return <FlagGermany {...getBoxProps(props)} />;
  }

  return null;
};

FlagIcon.defaultProps = {
  width: '1.4rem',
  height: '1.4rem',
};

export { FlagIcon };
