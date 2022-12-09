import { useAnnouncementModalContext } from '@/context/AnnouncementModalContext';
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
} as const;

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
      <Icon color={getValue('iconColor')} name={Icons.QUESTION_CIRCLE} />
    </Button>
  );
};

export { Features, NewFeatureTooltip };
