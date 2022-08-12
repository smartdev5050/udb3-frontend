import { difference } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useGetEventByIdQuery } from '@/hooks/api/events';
import { Event } from '@/types/Event';
import { Icon, Icons } from '@/ui/Icon';
import { Image } from '@/ui/Image';
import { Notification } from '@/ui/Notification';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';

import { Field } from './AdditionalInformationStep';

const IconMapping = {
  BADGE: 'badge',
  CELEBRATION: 'celebration',
  FIREWORKS: 'fireworks',
  PERFORMANCE: 'performance',
  THUMB_UP: 'thump-up',
  TROPHY: 'trophy',
} as const;

const ScoreIconMapping = {
  100: IconMapping.TROPHY,
  90: IconMapping.FIREWORKS,
  80: IconMapping.CELEBRATION,
  70: IconMapping.THUMB_UP,
  60: IconMapping.PERFORMANCE,
} as const;

const scoreWeightMapping = {
  type: {
    weight: 120,
    mandatory: true,
  },
  theme: {
    weight: 50,
    mandatory: false,
  },
  calendar: {
    weight: 120,
    mandatory: true,
  },
  location: {
    weight: 120,
    mandatory: true,
  },
  name: {
    weight: 120,
    mandatory: true,
  },
  typicalAgeRange: {
    weight: 120,
    mandatory: true,
  },
  media: {
    weight: 105,
    mandatory: false,
  },
  description: {
    weight: 80,
    mandatory: false,
  },
  price_info: {
    weight: 75,
    mandatory: false,
  },
  contact_info: {
    weight: 60,
    mandatory: false,
  },
  organizer: {
    weight: 30,
    mandatory: false,
  },
  video: {
    weight: 20,
    mandatory: false,
  },
};

const randomIcon = <Icon name={Icons.BUILDING} />;

type Props = {
  eventId: string;
  completedFields: Record<Field, boolean>;
};

const getMinimumScore = (): number => {
  let minimumScore = 0;

  Object.values(scoreWeightMapping).forEach((scoreWeight) => {
    if (scoreWeight.mandatory) minimumScore += scoreWeight.weight;
  });

  return minimumScore;
};

const minimumScore = getMinimumScore();

const EventScore = ({ completedFields, eventId, ...props }: Props) => {
  const getEventByIdQuery = useGetEventByIdQuery({ id: eventId });

  // @ts-expect-error
  const event: Event | undefined = getEventByIdQuery.data;

  const hasTheme: boolean = event?.terms.some(
    (term) => term.domain === 'theme',
  );

  const score = useMemo(() => {
    let completeScore = 0;
    Object.keys(completedFields).forEach((field) => {
      if (completedFields[field] && scoreWeightMapping[field]) {
        completeScore += scoreWeightMapping[field].weight;
      }
    });
    completeScore += hasTheme ? scoreWeightMapping.theme.weight : completeScore;
    return Math.round((completeScore + minimumScore) / 10);
  }, [completedFields, hasTheme]);

  const getIconName = (): string => {
    const nearestScore = Object.keys(ScoreIconMapping).reduce((prev, curr) => {
      return Math.abs(parseInt(curr) - score) < Math.abs(parseInt(prev) - score)
        ? curr
        : prev;
    });
    return ScoreIconMapping[nearestScore];
  };

  const iconName = getIconName();

  const Icon = (
    <Image
      width={50}
      height={50}
      alt="blabalb"
      src={`/assets/icons/${iconName}.png`}
    />
  );

  return (
    <Notification
      header={
        <Text>
          <span>{score}</span>/100
        </Text>
      }
      body="Tip: voeg nog een video toe"
      icon={Icon}
    />
  );
};

export { EventScore };
