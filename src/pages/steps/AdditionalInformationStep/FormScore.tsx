import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { eventTypesWithNoThemes } from '@/constants/EventTypes';
import { OfferTypes, ScopeTypes } from '@/constants/OfferType';
import { useGetEntityByIdAndScope } from '@/hooks/api/scope';
import { Scope } from '@/pages/create/OfferForm';
import { Offer } from '@/types/Offer';
import { Organizer } from '@/types/Organizer';
import { Inline } from '@/ui/Inline';
import { Link } from '@/ui/Link';
import { Notification } from '@/ui/Notification';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

import { Field } from './AdditionalInformationStep';

const GaugeComponent = dynamic(() => import('react-gauge-component'), {
  ssr: false,
});

const getValue = getValueFromTheme('colors');

type Weights = { [key: string]: { weight: number; mandatory: boolean } };

const scoreWeightMapping: Weights = {
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
  media: {
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
    weight: 3,
    mandatory: false,
  },
  booking_info: {
    weight: 3,
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

const organizerScoreWeightMapping: Weights = {
  name: {
    weight: 20,
    mandatory: true,
  },
  url: {
    weight: 20,
    mandatory: true,
  },
  contact_info: {
    weight: 20,
    mandatory: false,
  },
  description: {
    weight: 15,
    mandatory: false,
  },
  media: {
    weight: 15,
    mandatory: false,
  },
  location: {
    weight: 10,
    mandatory: false,
  },
};

type Props = {
  offerId: string;
  scope: Scope;
  completedFields: Record<Field, boolean>;
};

type EntityWithMedia =
  | (Offer & { images: undefined })
  | (Organizer & {
      terms: undefined;
      mediaObject: undefined;
      videos: undefined;
    });

const getScopeWeights = (scope: Scope): Weights =>
  scope === ScopeTypes.ORGANIZERS
    ? organizerScoreWeightMapping
    : scoreWeightMapping;

const getMinimumScore = (weights: Weights): number => {
  let minimumScore = 0;

  Object.values(weights).forEach((scoreWeight) => {
    if (scoreWeight.mandatory) minimumScore += scoreWeight.weight;
  });

  return minimumScore;
};

const DynamicBarometerIcon = ({ minimumScore, score, size = 70 }) => (
  <div
    css={`
      position: relative;
      width: ${size}px;
      height: ${size}px;
    `}
  >
    <div
      css={`
        position: absolute;
        z-index: -2;
        left: 32%;
        top: 38%;
        background-color: #efedee;
        border-radius: 100%;
        width: ${size * 0.35}px;
        height: ${size * 0.35}px;
      `}
    />
    <GaugeComponent
      style={{ width: '100%', height: '100%' }}
      marginInPercent={0.032}
      type="radial"
      minValue={minimumScore}
      value={score}
      arc={{
        padding: 0,
        cornerRadius: 0,
        width: 0.4,
        subArcs: [
          { limit: 75, color: '#F19E49' },
          { limit: 90, color: '#F9DE58' },
          { limit: 95, color: '#C2DF6B' },
          { limit: 100, color: '#90CC4F' },
        ],
      }}
      labels={{
        valueLabel: { hide: true },
        tickLabels: { hideMinMax: true },
      }}
      pointer={{
        color: '#B3ADB5',
        width: 50,
        length: 0.8,
      }}
    />
  </div>
);

const FormScore = ({ completedFields, offerId, scope }: Props) => {
  const { t } = useTranslation();

  const router = useRouter();

  const getEntityByIdQuery = useGetEntityByIdAndScope({ id: offerId, scope });
  const weights = getScopeWeights(scope);
  const minimumScore = useMemo(() => getMinimumScore(weights), [weights]);

  // @ts-expect-error
  const entity: EntityWithMedia | undefined = getEntityByIdQuery.data;

  const hasNoPossibleTheme = entity?.terms?.some(
    (term) =>
      term.domain === 'eventtype' && eventTypesWithNoThemes.includes(term.id),
  );

  const hasTheme: boolean =
    entity?.terms?.some((term) => term.domain === 'theme') ||
    hasNoPossibleTheme ||
    scope === OfferTypes.PLACES;

  const hasMediaObject: boolean =
    (entity?.mediaObject ?? entity?.images ?? []).length > 0;

  const hasVideo: boolean = (entity?.videos ?? []).length > 0;

  const fullCompletedFields = useMemo(
    () => ({
      ...completedFields,
      media: hasMediaObject,
      video: hasVideo,
      theme: hasTheme,
    }),
    [completedFields, hasMediaObject, hasVideo, hasTheme],
  );

  const score = useMemo(() => {
    let completeScore = 0;
    Object.keys(fullCompletedFields).forEach((field) => {
      if (fullCompletedFields[field] && weights[field]) {
        completeScore += weights[field].weight;
      }
    });

    return completeScore + minimumScore;
  }, [fullCompletedFields, weights, minimumScore]);

  const tipField = useMemo(() => {
    if (score === 100) return;

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
        weights[fieldKey] &&
        weights[fieldKey].weight > highestUncompletedValue.weight
      ) {
        highestUncompletedValue = {
          weight: weights[fieldKey].weight,
          fieldName: fieldKey,
        };
      }
    });

    const { fieldName } = highestUncompletedValue;

    return fieldName;
  }, [fullCompletedFields, score, weights]);

  const TipLink = ({ field }: { field: string }) => {
    const hash = field === 'video' ? 'media' : field;
    return (
      <Link
        color={getValue('link')}
        href={`#${hash}`}
        onClick={(e) => {
          e.preventDefault();
          router.push({ hash }, undefined, {
            shallow: true,
          });
        }}
      >
        {t(`create.additionalInformation.event_score.tip.${field}.link`)}
      </Link>
    );
  };

  return (
    <Notification
      header={
        <Inline id="offer-score" alignItems="center" spacing={2}>
          <Text
            display="inline-flex"
            alignItems="flex-end"
            fontSize="1.5rem"
            lineHeight="initial"
            fontWeight="bold"
          >
            <span id="current-score">{score}</span>
            <Text fontSize="1.2rem" fontWeight="bold">
              /100
            </Text>
          </Text>
        </Inline>
      }
      body={
        <Text>
          {score === 100 &&
            t(
              `create.additionalInformation.event_score.tip.completed.${
                scope === ScopeTypes.ORGANIZERS ? scope : 'offers'
              }`,
            )}
          {score !== 100 && (
            <Trans
              i18nKey={`create.additionalInformation.event_score.tip.${tipField}.text`}
            >
              Tip: <TipLink field={tipField} />
            </Trans>
          )}
        </Text>
      }
      icon={
        <DynamicBarometerIcon
          minimumScore={minimumScore}
          score={score}
          size={70}
        />
      }
    />
  );
};

export { FormScore };
