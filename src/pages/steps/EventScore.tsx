import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetEventByIdQuery } from '@/hooks/api/events';
import { Event } from '@/types/Event';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Notification } from '@/ui/Notification';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

import { Field } from './AdditionalInformationStep';

const getValue = getValueFromTheme('eventScore');

const BarometerIcon = ({ rotationValue }: { rotationValue: number }) => {
  const initialRotationValue = 15;

  return (
    <div
      css={`
        width: 70px;
      `}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 481 409">
        <g fill="none">
          <path
            fill="#CCE96F"
            fillOpacity=".95"
            d="M408.16 69.19s-21.09-5.07-21.61-4.87c-.53.2-40.58 43.92-40.58 43.92l3.53 19.62a156.2 156.2 0 0 1 47.6 109.31l6.13 9.75h70.11l6.94-9.77A239.12 239.12 0 0 0 408.16 69.2Z"
          />
          <path
            fill="#F9DE58"
            d="M243.87.78C177.94-.15 117.64 25.84 73.55 68.57l-.87 24.3 39.3 39.9 20.22-5.53a156.22 156.22 0 0 1 109.2-43.31l2.47.03v-.03L259.6 59.7V8.64L243.87.78Z"
          />
          <path
            fill="#F19E4A"
            d="M124.4 346.15a156.19 156.19 0 0 1-40.74-108.99l-10.1-21.54-62.37 3.6-10.7 17.94A239.13 239.13 0 0 0 65.1 404.55a7.86 7.86 0 0 0 11.28.14l47.72-47.72a7.84 7.84 0 0 0 .28-10.82Z"
          />
          <circle cx="238.52" cy="237.17" r="105.89" fill="#EFEDEE" />
          <path
            fill="#90CC4F"
            d="m480.28 237.15.03 3.54c0 63.32-24.52 120.9-64.58 163.77a7.89 7.89 0 0 1-11.35.23l-47.72-47.72a7.84 7.84 0 0 1-.3-10.8 156.2 156.2 0 0 0 40.75-109l83.17-.02Z"
          />
          <path
            fill="#F9DE58"
            d="M258.95 8.32 243.87.78C177.94-.15 117.64 25.84 73.55 68.56l-.87 24.3 16.09 16.35c38.38-53.3 99.45-91 170.18-100.9Z"
          />
          <path
            fill="#F9DE58"
            d="m408.16 69.19-.15.16-58.51 58.51a156.23 156.23 0 0 0-105.63-43.9V.78a239.12 239.12 0 0 1 164.3 68.41Z"
          />
          <g fill="#F19E4A">
            <path d="M45.97 240.67c0-7.94.43-15.8 1.25-23.53l-36.03 2.08-10.7 17.94A239.13 239.13 0 0 0 65.1 404.54a7.86 7.86 0 0 0 11.28.15l21.15-21.15c-32.34-39.59-51.57-89.11-51.57-142.87Z" />
            <path d="m131.7 126.72.5.52a156.28 156.28 0 0 0-48.54 109.92H.5v-.47c1.08-65.96 28.95-125.4 73.06-168.12l.23.23 57.92 57.92Z" />
          </g>
          <path
            fill="#F8D448"
            d="M289.55 5.82A240.74 240.74 0 0 0 243.87.78v10.1a266.1 266.1 0 0 1 45.68-5.06Z"
          />
          <path
            fill="#F19E4A"
            d="M99.91 94.93 73.78 68.8l-.23-.23C29.45 111.28 1.57 170.73.5 236.69v.47h45.53c.84-53.7 20.84-103.03 53.9-142.23Z"
          />
          <path
            css={`
              transform: rotate(
                ${rotationValue === 0 ? initialRotationValue : rotationValue}deg
              );
              transform-origin: 50% 58%;
              transition: transform 1s ease-in-out;
            `}
            fill="#B3ADB5"
            d="m118.3 351.95 102.98-64.2a53.9 53.9 0 0 0 56.94-87.33 53.88 53.88 0 0 0-92.4 48.25L112.01 345c-3.24 4.21 1.8 9.76 6.3 6.95Z"
          />
        </g>
      </svg>
    </div>
  );
};

const scoreWeightMapping = {
  type: {
    weight: 12,
    mandatory: true,
  },
  theme: {
    weight: 5,
    mandatory: false,
  },
  calendar: {
    weight: 12,
    mandatory: true,
  },
  location: {
    weight: 12,
    mandatory: true,
  },
  name: {
    weight: 12,
    mandatory: true,
  },
  typicalAgeRange: {
    weight: 12,
    mandatory: true,
  },
  mediaObject: {
    weight: 8,
    mandatory: false,
  },
  description: {
    weight: 9,
    mandatory: false,
  },
  price_info: {
    weight: 7,
    mandatory: false,
  },
  contact_info: {
    weight: 6,
    mandatory: false,
  },
  organizer: {
    weight: 3,
    mandatory: false,
  },
  video: {
    weight: 2,
    mandatory: false,
  },
};

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
  const { t } = useTranslation();

  const getEventByIdQuery = useGetEventByIdQuery({ id: eventId });

  // @ts-expect-error
  const event: Event | undefined = getEventByIdQuery.data;

  const hasTheme: boolean = event?.terms.some(
    (term) => term.domain === 'theme',
  );

  const hasMediaObject: boolean = (event?.mediaObject ?? []).length > 0;

  const hasVideo: boolean = (event?.videos ?? []).length > 0;

  const fullCompletedFields = useMemo(() => {
    return {
      ...completedFields,
      mediaObject: hasMediaObject,
      video: hasVideo,
      theme: hasTheme,
    };
  }, [completedFields, hasMediaObject, hasVideo, hasTheme]);

  const score = useMemo(() => {
    let completeScore = 0;
    Object.keys(fullCompletedFields).forEach((field) => {
      if (fullCompletedFields[field] && scoreWeightMapping[field]) {
        completeScore += scoreWeightMapping[field].weight;
      }
    });

    return completeScore + minimumScore;
  }, [fullCompletedFields]);

  const rotationValue = useMemo(() => {
    const maxRotation = 260;

    const scorePercentage = (score - minimumScore) / (100 - minimumScore);

    return maxRotation * scorePercentage;
  }, [score]);

  const tip = useMemo(() => {
    if (score === 100)
      return t(`create.additionalInformation.event_score.tip.completed`);
    // find uncompleted fields with the highest weight to give a tip to the user
    const unCompletedFieldKeys = Object.keys(fullCompletedFields).filter(
      (key) => !fullCompletedFields[key],
    );

    let highestUncompletedValue = {
      weight: 0,
      fieldName: '',
    };

    unCompletedFieldKeys.forEach((fieldKey: string) => {
      if (
        scoreWeightMapping[fieldKey] &&
        scoreWeightMapping[fieldKey].weight > highestUncompletedValue.weight
      ) {
        highestUncompletedValue = {
          weight: scoreWeightMapping[fieldKey].weight,
          fieldName: fieldKey,
        };
      }
    });

    const { fieldName } = highestUncompletedValue;

    return t(`create.additionalInformation.event_score.tip.${fieldName}`);
  }, [fullCompletedFields, score, t]);

  return (
    <Notification
      header={
        <Inline alignItems="center" spacing={2}>
          <Text
            display="inline-flex"
            alignItems="flex-end"
            fontSize="1.5rem"
            lineHeight="initial"
            fontWeight="bold"
          >
            {score}
            <Text fontSize="1.2rem" fontWeight="bold">
              /100
            </Text>
          </Text>
          <Button variant={ButtonVariants.UNSTYLED}>
            <Icon color={getValue('infoIconColor')} name={Icons.QUESTION} />
          </Button>
        </Inline>
      }
      body={<Text>{tip}</Text>}
      icon={<BarometerIcon rotationValue={rotationValue} />}
    />
  );
};

export { EventScore };
