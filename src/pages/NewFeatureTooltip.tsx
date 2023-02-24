import { css } from 'styled-components';

import { useAnnouncementModalContext } from '@/context/AnnouncementModalContext';
import { Badge, BadgeVariants } from '@/ui/Badge';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { getInlineProps, InlineProps } from '@/ui/Inline';
import { getValueFromTheme } from '@/ui/theme';

const getValue = getValueFromTheme('newFeatureTooltip');

const Features = {
  EVENT_SCORE: '27f6ab5d-5ca3-4933-a8bf-ccce25b40723',
  SUGGESTED_ORGANIZERS: '0842bd10-592a-42ad-8a72-fabc278b7fd4',
  VIDEO: '9cdbba1f-0fd8-4702-a274-c2403316dea9',
  ONLINE: '5d8547e4-4cef-4288-86c8-23da918b9c43',
  GERMAN_POSTALCODES: '1541df31-4616-4ee3-95f2-8e8b87b6d49d',
} as const;

const QuestionCircleIcon = () => {
  return (
    <Badge
      variant={BadgeVariants.SECONDARY}
      borderRadius={'50%'}
      padding={2}
      css={css`
        aspect-ratio: 1 / 1;

        &.badge {
          background-color: ${getValue('backgroundColor')};
        }
      `}
    >
      <Icon
        name={Icons.QUESTION}
        color="white"
        width="0.8rem"
        height="0.8rem"
      />
    </Badge>
  );
};

type Props = {
  featureUUID: string;
} & InlineProps;

const NewFeatureTooltip = ({ featureUUID, ...props }: Props) => {
  const [_, setAnnouncementModalContext] = useAnnouncementModalContext();

  return (
    <Button
      onClick={() =>
        setAnnouncementModalContext((prevModalContext) => ({
          ...prevModalContext,
          visible: true,
          visibleAnnouncementUid: featureUUID,
        }))
      }
      variant={ButtonVariants.UNSTYLED}
      {...getInlineProps(props)}
    >
      <QuestionCircleIcon />
    </Button>
  );
};

export { Features, NewFeatureTooltip, QuestionCircleIcon };
