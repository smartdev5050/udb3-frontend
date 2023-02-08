import debounce from 'lodash/debounce';
import { useMemo, useState } from 'react';
import { Highlighter } from 'react-bootstrap-typeahead';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

import { useGetOffersByCreatorQuery } from '@/hooks/api/offers';
import { useGetOrganizersByQueryQuery } from '@/hooks/api/organizers';
import { useGetUserQuery } from '@/hooks/api/user';
import { SupportedLanguages } from '@/i18n/index';
import { Features, NewFeatureTooltip } from '@/pages/NewFeatureTooltip';
import { Organizer } from '@/types/Organizer';
import { Values } from '@/types/Values';
import { Alert, AlertVariants } from '@/ui/Alert';
import { Badge, BadgeVariants } from '@/ui/Badge';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Paragraph } from '@/ui/Paragraph';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getGlobalBorderRadius, getValueFromTheme } from '@/ui/theme';
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
} & StackProps) => {
  const { t } = useTranslation();

  if (organizers.length === 0) {
    return null;
  }

  return (
    <Stack spacing={4} {...getStackProps(props)}>
      <Inline>
        <Text fontWeight="bold">
          {t(
            'create.additionalInformation.organizer.select_recent_used_organizer',
          )}
        </Text>
        <NewFeatureTooltip featureUUID={Features.SUGGESTED_ORGANIZERS} />
      </Inline>
      <Alert variant={AlertVariants.PRIMARY} width="41rem">
        {t(
          'create.additionalInformation.organizer.select_recent_used_organizer_info',
        )}
      </Alert>
      <Inline spacing={4} justifyContent="flex-start" flexWrap="wrap">
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
              padding={4}
              borderRadius={getGlobalBorderRadius}
              variant={ButtonVariants.UNSTYLED}
              customChildren
              marginBottom={4}
              width="20rem"
              title={name}
              css={`
                flex-direction: column;
                align-items: flex-start;
                background-color: rgba(255, 255, 255, 1);
                box-shadow: ${({ theme }) =>
                  theme.components.button.boxShadow.small};

                &:hover {
                  background-color: #e6e6e6;
                }
              `}
            >
              <Paragraph
                fontWeight="bold"
                display="flex"
                justifyContent="space-between"
                width="18rem"
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
                {isUitpasOrganizer(organizer) && <UitpasBadge />}
              </Paragraph>
              {address && (
                <Text
                  textAlign="left"
                  width="80%"
                  css={`
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  `}
                >
                  {address.postalCode} {address.addressLocality}
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

const UitpasBadge = () => {
  const { t } = useTranslation();
  return <Badge variant={BadgeVariants.SECONDARY}>{t('brand_uitpas')}</Badge>;
};

const OrganizerPicker = ({
  organizer,
  onChange,
  onAddNewOrganizer,
  onDeleteOrganizer,
  ...props
}: Props) => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  const getUserQuery = useGetUserQuery();
  // @ts-expect-error
  const user = getUserQuery.data;

  const [addButtonHasBeenPressed, setAddButtonHasBeenPressed] = useState(false);
  const [organizerSearchInput, setOrganizerSearchInput] = useState('');

  const getOrganizersByQueryQuery = useGetOrganizersByQueryQuery(
    { name: organizerSearchInput },
    { enabled: !!organizerSearchInput },
  );

  const getOffersByCreatorQuery = useGetOffersByCreatorQuery({
    advancedQuery: '_exists_:organizer.id',
    creator: user,
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

  const handleSelectRecentOrganizer = (organizerId: string) => {
    onChange(organizerId);
    setAddButtonHasBeenPressed(false);
  };

  return (
    <Stack width="100%" {...getStackProps(props)}>
      <FormElement
        id="create-organizer"
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
          ) : (
            <Inline width="100%" flexWrap="wrap">
              <RecentUsedOrganizers
                organizers={recentUsedOrganizers}
                onChange={handleSelectRecentOrganizer}
                width={{ s: '100%', default: '60%' }}
                maxWidth="50rem"
              />
              <Stack width={{ s: '100%', default: '40%' }}>
                <Text fontWeight="bold" marginBottom={4}>
                  {t(
                    'create.additionalInformation.organizer.or_choose_other_organizer',
                  )}
                </Text>
                {!addButtonHasBeenPressed && (
                  <Button
                    alignSelf="flex-start"
                    variant={ButtonVariants.SECONDARY}
                    onClick={() => setAddButtonHasBeenPressed(true)}
                  >
                    {t('create.additionalInformation.organizer.add_new_button')}
                  </Button>
                )}
                {addButtonHasBeenPressed && (
                  <Typeahead<Organizer>
                    options={organizers}
                    labelKey={(org) => getOrganizerName(org, i18n.language)}
                    renderMenuItemChildren={(org: Organizer, { text }) => {
                      const name = getOrganizerName(org, i18n.language);
                      return (
                        <Inline spacing={3}>
                          <Text>
                            <Highlighter search={text}>{name}</Highlighter>
                          </Text>
                          {isUitpasOrganizer(org) && <UitpasBadge />}
                        </Inline>
                      );
                    }}
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
                    minLength={3}
                    newSelectionPrefix={t(
                      'create.additionalInformation.organizer.add_new_label',
                    )}
                    allowNew
                  />
                )}
              </Stack>
            </Inline>
          )
        }
      />
    </Stack>
  );
};

export { isUitpasOrganizer, OrganizerPicker };
