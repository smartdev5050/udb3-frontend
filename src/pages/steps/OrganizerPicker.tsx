import debounce from 'lodash/debounce';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

import { useGetOffersByCreatorQuery } from '@/hooks/api/offers';
import { useGetOrganizersByQueryQuery } from '@/hooks/api/organizers';
import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import { SupportedLanguages } from '@/i18n/index';
import { Organizer } from '@/types/Organizer';
import { Values } from '@/types/Values';
import { Badge, BadgeVariants } from '@/ui/Badge';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Paragraph } from '@/ui/Paragraph';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { isNewEntry, NewEntry, Typeahead } from '@/ui/Typeahead';
import { parseOfferId } from '@/utils/parseOfferId';
import { valueToArray } from '@/utils/valueToArray';

const MAX_RECENT_USED_ORGANIZERS = 4;

const getValueFromGlobalTheme = getValueFromTheme('global');

const isUitpasOrganizer = (organizer: Organizer): boolean => {
  const combinedLabels = (organizer.labels || []).concat(
    organizer.hiddenLabels || [],
  );

  return combinedLabels.some(
    (label) =>
      (typeof label === 'string' && label.toLowerCase().includes('uitpas')) ||
      label.toLowerCase().includes('paspartoe'),
  );
};

const RecentUsedOrganizers = ({
  organizers,
  onChange,
  ...props
}: {
  organizers: Organizer[];
  onChange: (organizerId: string) => void;
}) => {
  const { t } = useTranslation();

  if (organizers.length === 0) {
    return null;
  }

  return (
    <Stack spacing={4} {...getStackProps(props)}>
      <Text fontWeight="bold">
        {t(
          'create.additionalInformation.organizer.or_select_recent_used_organizer',
        )}
      </Text>
      <Inline spacing={4} flexWrap="wrap" maxWidth="60rem">
        {organizers.map((organizer, index) => {
          const name =
            typeof organizer.name === 'string'
              ? organizer.name
              : organizer.name[organizer.mainLanguage];
          const address = organizer.address
            ? organizer.address.hasOwnProperty(organizer.mainLanguage)
              ? organizer.address[organizer.mainLanguage]
              : organizer.address
            : '';
          return (
            <Button
              key={index}
              onClick={() => onChange(parseOfferId(organizer['@id']))}
              paddingTop={4}
              paddingBottom={4}
              paddingLeft={5}
              paddingRight={5}
              borderRadius="0.5rem"
              variant={ButtonVariants.UNSTYLED}
              customChildren
              marginBottom={4}
              maxWidth="25rem"
              title={name}
              css={`
                flex-direction: column;
                align-items: flex-start;
                background-color: rgba(255, 255, 255, 1);
                box-shadow: 0px 2px 3px 0px rgba(210, 210, 210, 0.5);

                &:hover {
                  background-color: #e6e6e6;
                }
              `}
            >
              <Paragraph
                fontWeight="bold"
                display="flex"
                justifyContent="space-between"
                width="20rem"
                textAlign="left"
              >
                <Text
                  width="80%"
                  css={`
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  `}
                >
                  {name}
                </Text>
                {isUitpasOrganizer(organizer) && (
                  <Badge variant={BadgeVariants.SECONDARY}>
                    {t('brand_uitpas')}
                  </Badge>
                )}
              </Paragraph>
              {address && (
                <Text textAlign="left">
                  {address.streetAddress} - {address.postalCode}{' '}
                  {address.addressLocality}
                </Text>
              )}
            </Button>
          );
        })}
      </Inline>
    </Stack>
  );
};

type Props = Omit<StackProps, 'onChange'> & {
  organizer: Organizer;
  onChange: (organizerId: string) => void;
  onAddNewOrganizer: (organizer: NewEntry) => void;
  onDeleteOrganizer: (organizerId: string) => void;
};

const getOrganizerName = (org: Organizer, language: string) =>
  (typeof org.name === 'string' ? org.name : org.name[language]) ??
  org.name[org.mainLanguage];

const OrganizerPicker = ({
  organizer,
  onChange,
  onAddNewOrganizer,
  onDeleteOrganizer,
  ...props
}: Props) => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  const { cookies } = useCookiesWithOptions(['user']);

  const [addButtonHasBeenPressed, setAddButtonHasBeenPressed] = useState(false);
  const [organizerSearchInput, setOrganizerSearchInput] = useState('');

  const getOrganizersByQueryQuery = useGetOrganizersByQueryQuery(
    { q: organizerSearchInput },
    { enabled: !!organizerSearchInput },
  );

  const getOffersByCreatorQuery = useGetOffersByCreatorQuery({
    advancedQuery: '_exists_:organizer.id',
    creator: cookies.user,
    paginationOptions: { start: 0, limit: 20 },
  });

  const recentUsedOrganizers = useMemo(() => {
    const recentOrganizers = [];

    // @ts-expect-error
    getOffersByCreatorQuery.data?.member.forEach((event) => {
      if (
        event.organizer &&
        !recentOrganizers.some(
          (recentOrganizer) =>
            recentOrganizer['@id'] === event.organizer['@id'],
        )
      )
        recentOrganizers.push(event.organizer);
    });

    return recentOrganizers.slice(0, MAX_RECENT_USED_ORGANIZERS);

    // @ts-expect-error
  }, [getOffersByCreatorQuery.data?.member]);

  const organizers = useMemo(() => {
    // @ts-expect-error
    return getOrganizersByQueryQuery.data?.member ?? [];
    // @ts-expect-error
  }, [getOrganizersByQueryQuery.data?.member]);

  return (
    <Stack {...getStackProps(props)}>
      <FormElement
        id="create-organizer"
        label={t('create.additionalInformation.organizer.title')}
        Component={
          organizer ? (
            <Stack>
              <Inline alignItems="center" paddingY={3} spacing={3}>
                <Icon
                  name={Icons.CHECK_CIRCLE}
                  color={getValueFromGlobalTheme('successIcon')}
                />
                <Text>
                  {getOrganizerName(
                    organizer,
                    i18n.language as Values<typeof SupportedLanguages>,
                  )}
                </Text>
                <Button
                  spacing={3}
                  variant={ButtonVariants.LINK}
                  onClick={() =>
                    onDeleteOrganizer(parseOfferId(organizer['@id']))
                  }
                >
                  {t('create.additionalInformation.organizer.change')}
                </Button>
              </Inline>
            </Stack>
          ) : !addButtonHasBeenPressed ? (
            <Stack alignItems="flex-start" spacing={4}>
              <Button
                variant={ButtonVariants.SECONDARY}
                onClick={() => setAddButtonHasBeenPressed(true)}
              >
                {t('create.additionalInformation.organizer.add_new_button')}
              </Button>
              <RecentUsedOrganizers
                organizers={recentUsedOrganizers}
                onChange={onChange}
              />
            </Stack>
          ) : (
            <Stack spacing={4}>
              <Typeahead<Organizer>
                options={organizers}
                labelKey={(org) => getOrganizerName(org, i18n.language)}
                selected={valueToArray(organizer)}
                onInputChange={debounce(setOrganizerSearchInput, 275)}
                onChange={(organizers) => {
                  const organizer = organizers[0];

                  if (isNewEntry(organizer)) {
                    onAddNewOrganizer(organizer);
                    queryClient.invalidateQueries('organizers');
                    return;
                  }

                  onChange(parseOfferId(organizer['@id']));
                }}
                maxWidth="30rem"
                minLength={3}
                newSelectionPrefix={t(
                  'create.additionalInformation.organizer.add_new_label',
                )}
                allowNew
              />
              <RecentUsedOrganizers
                organizers={recentUsedOrganizers}
                onChange={onChange}
              />
            </Stack>
          )
        }
      />
    </Stack>
  );
};

export { OrganizerPicker };
