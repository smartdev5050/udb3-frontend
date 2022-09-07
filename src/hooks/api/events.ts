import type { UseQueryOptions } from 'react-query';

import type { CalendarType } from '@/constants/CalendarType';
import type { Event } from '@/types/Event';
import type { BookingAvailability, Status, Term } from '@/types/Offer';
import type { User } from '@/types/User';
import type { Values } from '@/types/Values';
import type { WorkflowStatus } from '@/types/WorkflowStatus';
import { createEmbededCalendarSummaries } from '@/utils/createEmbededCalendarSummaries';
import { createSortingArgument } from '@/utils/createSortingArgument';
import { fetchFromApi, isErrorObject } from '@/utils/fetchFromApi';
import { formatDateToISO } from '@/utils/formatDateToISO';

import type {
  AuthenticatedQueryOptions,
  CalendarSummaryFormats,
  PaginationOptions,
  ServerSideQueryOptions,
  SortOptions,
} from './authenticated-query';
import {
  useAuthenticatedMutation,
  useAuthenticatedQueries,
  useAuthenticatedQuery,
} from './authenticated-query';
import type { Headers } from './types/Headers';

type TimeSpan = {
  start: string;
  end: string;
};

type Calendar = {
  calendarType: Values<typeof CalendarType>;
  timeSpans: TimeSpan[];
};

type EventArguments = {
  name: string;
  calendar: Calendar;
  type: Term;
  theme: Term;
  workflowStatus: WorkflowStatus;
  audienceType: string;
  location: {
    id: string;
  };
  mainLanguage: string;
};
type AddEventArguments = EventArguments & { headers: Headers };

const addEvent = async ({
  headers,
  mainLanguage,
  name,
  calendar,
  type,
  theme,
  location,
  audienceType,
}: AddEventArguments) =>
  fetchFromApi({
    path: '/events/',
    options: {
      headers,
      method: 'POST',
      body: JSON.stringify({
        mainLanguage,
        name,
        calendar,
        type,
        theme,
        location,
        audienceType,
      }),
    },
  });

const useAddEventMutation = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: addEvent,
    ...configuration,
  });

const getEventsToModerate = async ({ headers, queryKey, ...queryData }) => {
  const res = await fetchFromApi({
    path: '/events/',
    searchParams: {
      ...queryData,
      availableFrom: formatDateToISO(new Date()),
    },
    options: {
      headers,
    },
  });
  if (isErrorObject(res)) {
    // eslint-disable-next-line no-console
    return console.error(res);
  }
  return await res.json();
};

const useGetEventsToModerateQuery = (searchQuery, configuration = {}) =>
  useAuthenticatedQuery<Event[]>({
    queryKey: ['events'],
    queryFn: getEventsToModerate,
    queryArguments: {
      q: searchQuery,
      audienceType: 'everyone',
      availableTo: '*',
      limit: 1,
      start: 0,
      workflowStatus: 'READY_FOR_VALIDATION',
    },
    enabled: !!searchQuery,
    ...configuration,
  });

const getEventById = async ({ headers, id }) => {
  const res = await fetchFromApi({
    path: `/event/${id.toString()}`,
    options: {
      headers,
    },
  });
  if (isErrorObject(res)) {
    // eslint-disable-next-line no-console
    return console.error(res);
  }
  return await res.json();
};

type UseGetEventByIdArguments = ServerSideQueryOptions & {
  id: string;
};

const useGetEventByIdQuery = (
  { req, queryClient, id }: UseGetEventByIdArguments,
  configuration = {},
) =>
  useAuthenticatedQuery({
    req,
    queryClient,
    queryKey: ['events'],
    queryFn: getEventById,
    queryArguments: { id },
    enabled: !!id,
    refetchOnWindowFocus: false,
    ...configuration,
  });

const useGetEventsByIdsQuery = ({ req, queryClient, ids = [] }) => {
  const options = ids.map((id) => ({
    queryKey: ['events'],
    queryFn: getEventById,
    queryArguments: { id },
    enabled: !!id,
  }));

  return useAuthenticatedQueries({ req, queryClient, options });
};

const deleteEventById = async ({ headers, id }) =>
  fetchFromApi({
    path: `/events/${id}`,
    options: { headers, method: 'DELETE' },
  });

const useDeleteEventByIdMutation = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: deleteEventById,
    ...configuration,
  });

const getEventsByCreator = async ({ headers, ...queryData }) => {
  const res = await fetchFromApi({
    path: '/events/',
    searchParams: {
      ...queryData,
    },
    options: {
      headers,
    },
  });
  if (isErrorObject(res)) {
    // eslint-disable-next-line no-console
    return console.error(res);
  }
  return await res.json();
};

const useGetEventsByCreatorQuery = (
  {
    req,
    queryClient,
    creator,
    paginationOptions = { start: 0, limit: 50 },
    sortOptions = { field: 'modified', order: 'desc' },
    calendarSummaryFormats = ['lg-text', 'sm-text'],
  }: AuthenticatedQueryOptions<
    PaginationOptions &
      SortOptions &
      CalendarSummaryFormats & {
        creator: User;
      }
  >,
  configuration: UseQueryOptions = {},
) =>
  useAuthenticatedQuery<Event[]>({
    req,
    queryClient,
    queryKey: ['events'],
    queryFn: getEventsByCreator,
    queryArguments: {
      q: `creator:(${creator.id} OR ${creator.email})`,
      disableDefaultFilters: true,
      embed: true,
      limit: paginationOptions.limit,
      start: paginationOptions.start,
      workflowStatus: 'DRAFT,READY_FOR_VALIDATION,APPROVED,REJECTED',
      ...createSortingArgument(sortOptions),
      ...createEmbededCalendarSummaries(calendarSummaryFormats),
    },
    enabled: !!(creator.id && creator.email),
    ...configuration,
  });

const getCalendarSummary = async ({ headers, id, format, locale }) => {
  const res = await fetchFromApi({
    path: `/events/${id.toString()}/calsum`,
    searchParams: {
      format,
      langCode: `${locale}_BE`,
    },
    options: {
      headers,
    },
  });
  if (isErrorObject(res)) {
    // eslint-disable-next-line no-console
    return console.error(res);
  }

  return res.text();
};

const useGetCalendarSummaryQuery = (
  { id, locale, format = 'lg' },
  configuration: UseQueryOptions = {},
) =>
  useAuthenticatedQuery({
    queryKey: ['events'],
    queryFn: getCalendarSummary,
    queryArguments: {
      id,
      locale,
      format,
    },
    enabled: !!id && !!locale,
    ...configuration,
  });

const changeTheme = async ({ headers, id, themeId }) => {
  if (!themeId) {
    // This will be implemented on the backend https://jira.uitdatabank.be/browse/III-4378
    return fetchFromApi({
      path: `/events/${id.toString()}/theme`,
      options: {
        method: 'DELETE',
        headers,
      },
    });
  }

  return fetchFromApi({
    path: `/events/${id.toString()}/theme/${themeId}`,
    options: {
      method: 'PUT',
      headers,
    },
  });
};

const useChangeThemeMutation = (configuration = {}) =>
  useAuthenticatedMutation({ mutationFn: changeTheme, ...configuration });

const changeType = async ({ headers, id, typeId }) =>
  fetchFromApi({
    path: `/events/${id.toString()}/type/${typeId}`,
    options: {
      method: 'PUT',
      headers,
    },
  });

const useChangeTypeMutation = (configuration = {}) =>
  useAuthenticatedMutation({ mutationFn: changeType, ...configuration });

const changeLocation = async ({ headers, id, locationId }) => {
  return fetchFromApi({
    path: `/events/${id.toString()}/location/${locationId}`,
    options: {
      method: 'PUT',
      headers,
    },
  });
};

const useChangeLocationMutation = (configuration = {}) =>
  useAuthenticatedMutation({ mutationFn: changeLocation, ...configuration });

const changeName = async ({ headers, id, lang, name }) => {
  return fetchFromApi({
    path: `/events/${id.toString()}/name/${lang}`,
    options: {
      method: 'PUT',
      body: JSON.stringify({ name }),
      headers,
    },
  });
};

const useChangeNameMutation = (configuration = {}) =>
  useAuthenticatedMutation({ mutationFn: changeName, ...configuration });

const changeCalendar = async ({
  headers,
  id,
  calendarType,
  timeSpans,
  start,
  end,
  startDate,
  endDate,
  openingHours,
  dayOfWeek,
  opens,
  closes,
}) => {
  return fetchFromApi({
    path: `/events/${id.toString()}/calendar`,
    options: {
      method: 'PUT',
      body: JSON.stringify({
        calendarType,
        timeSpans,
        start,
        end,
        startDate,
        endDate,
        openingHours,
        dayOfWeek,
        opens,
        closes,
      }),
      headers,
    },
  });
};

const useChangeCalendarMutation = (configuration = {}) =>
  useAuthenticatedMutation({ mutationFn: changeCalendar, ...configuration });

const changeStatus = async ({ headers, id, type, reason }) =>
  fetchFromApi({
    path: `/events/${id.toString()}/status`,
    options: {
      method: 'PUT',
      headers,
      body: JSON.stringify({ type, reason }),
    },
  });

const useChangeStatusMutation = (configuration = {}) =>
  useAuthenticatedMutation({ mutationFn: changeStatus, ...configuration });

const changeStatusSubEvents = async ({
  headers,
  eventId,
  subEventIds = [],
  subEvents = [],
  type,
  reason,
  bookingAvailability,
}) =>
  fetchFromApi({
    path: `/events/${eventId.toString()}/subEvents`,
    options: {
      method: 'PATCH',
      headers,
      body: JSON.stringify(
        subEventIds.map((id) =>
          createSubEventPatch(id, subEvents, type, reason, bookingAvailability),
        ),
      ),
    },
  });

type SubEventPatch = {
  id: number;
  status?: Status;
  bookingAvailability?: BookingAvailability;
};

const createSubEventPatch = (
  id,
  subEvents,
  type,
  reason,
  bookingAvailability,
) => {
  const subEventPatch: SubEventPatch = { id };

  if (type) {
    subEventPatch.status = {
      type,
      reason: {
        ...(subEvents[id].status.type === type && subEvents[id].status.reason),
        ...reason,
      },
    };
  }

  if (bookingAvailability) {
    subEventPatch.bookingAvailability = {
      type: bookingAvailability,
    };
  }

  return subEventPatch;
};

const useChangeStatusSubEventsMutation = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: changeStatusSubEvents,
    ...configuration,
  });

const addImageToEvent = async ({ headers, eventId, imageId }) =>
  fetchFromApi({
    path: `/events/${eventId.toString()}/images`,
    options: {
      method: 'POST',
      headers,
      body: JSON.stringify({ mediaObjectId: imageId }),
    },
  });

const useAddImageToEventMutation = (configuration = {}) =>
  useAuthenticatedMutation({ mutationFn: addImageToEvent, ...configuration });

const updateImageFromEvent = async ({
  headers,
  eventId,
  imageId,
  description,
  copyrightHolder,
}) =>
  fetchFromApi({
    path: `/events/${eventId.toString()}/images/${imageId.toString()}`,
    options: {
      method: 'PUT',
      headers,
      body: JSON.stringify({ description, copyrightHolder }),
    },
  });

const addEventMainImage = async ({ headers, eventId, imageId }) =>
  fetchFromApi({
    path: `/events/${eventId.toString()}/images/main`,
    options: {
      method: 'POST',
      headers,
      body: JSON.stringify({ mediaObjectId: imageId }),
    },
  });

const useAddEventMainImageMutation = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: addEventMainImage,
    ...configuration,
  });

const useUpdateImageFromEventMutation = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: updateImageFromEvent,
    ...configuration,
  });

const deleteImageFromEvent = async ({ headers, eventId, imageId }) =>
  fetchFromApi({
    path: `/events/${eventId.toString()}/images/${imageId.toString()}`,
    options: {
      method: 'DELETE',
      headers,
    },
  });

const useDeleteImageFromEventMutation = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: deleteImageFromEvent,
    ...configuration,
  });

const changeDescription = async ({ headers, eventId, language, description }) =>
  fetchFromApi({
    path: `/events/${eventId}/description/${language}`,
    options: {
      method: 'PUT',
      headers,
      body: JSON.stringify({ description }),
    },
  });

const useChangeDescriptionMutation = (configuration = {}) =>
  useAuthenticatedMutation({ mutationFn: changeDescription, ...configuration });

const changeTypicalAgeRange = async ({ headers, eventId, typicalAgeRange }) =>
  fetchFromApi({
    path: `/events/${eventId}/typicalAgeRange`,
    options: {
      method: 'PUT',
      headers,
      body: JSON.stringify({ typicalAgeRange }),
    },
  });

const useChangeTypicalAgeRangeMutation = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: changeTypicalAgeRange,
    ...configuration,
  });

const addLabel = async ({ headers, eventId, label }) =>
  fetchFromApi({
    path: `/events/${eventId}/labels/${label}`,
    options: {
      method: 'PUT',
      headers,
    },
  });

const useAddLabelMutation = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: addLabel,
    ...configuration,
  });

const addPriceInfo = async ({ headers, eventId, priceInfo }) =>
  fetchFromApi({
    path: `/events/${eventId}/priceInfo`,
    options: {
      method: 'PUT',
      headers,
      body: JSON.stringify(priceInfo),
    },
  });

const useAddPriceInfoMutation = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: addPriceInfo,
    ...configuration,
  });

const addContactPoint = async ({ headers, eventId, contactPoint }) =>
  fetchFromApi({
    path: `/events/${eventId}/contactPoint`,
    options: {
      method: 'PUT',
      headers,
      body: JSON.stringify({ contactPoint }),
    },
  });

const useAddContactPointMutation = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: addContactPoint,
    ...configuration,
  });

const addBookingInfo = async ({ headers, eventId, bookingInfo }) => {
  fetchFromApi({
    path: `/events/${eventId}/bookingInfo`,
    options: {
      method: 'PUT',
      headers,
      body: JSON.stringify({ bookingInfo }),
    },
  });
};

const useAddBookingInfoMutation = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: addBookingInfo,
    ...configuration,
  });

const addOrganizerToEvent = async ({ headers, eventId, organizerId }) =>
  fetchFromApi({
    path: `/events/${eventId}/organizer/${organizerId}`,
    options: {
      method: 'PUT',
      headers,
    },
  });

const useAddOrganizerToEventMutation = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: addOrganizerToEvent,
    ...configuration,
  });

const deleteOrganizerFromEvent = async ({ headers, eventId, organizerId }) =>
  fetchFromApi({
    path: `/events/${eventId}/organizer/${organizerId}`,
    options: {
      method: 'DELETE',
      headers,
    },
  });

const useDeleteOrganizerFromEventMutation = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: deleteOrganizerFromEvent,
    ...configuration,
  });

const publish = async ({ headers, eventId, publicationDate }) =>
  fetchFromApi({
    path: `/event/${eventId}`,
    options: {
      method: 'PATCH',
      headers: {
        ...headers,
        'Content-Type': 'application/ld+json;domain-model=Publish',
      },
      body: JSON.stringify({ publicationDate }),
    },
  });

const usePublishMutation = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: publish,
    ...configuration,
  });

const addVideoToEvent = async ({ headers, eventId, url, language }) =>
  fetchFromApi({
    path: `/events/${eventId}/videos`,
    options: {
      method: 'POST',
      headers,
      body: JSON.stringify({
        url,
        language,
      }),
    },
  });

const useAddVideoToEventMutation = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: addVideoToEvent,
    ...configuration,
  });

const deleteVideoFromEvent = async ({ headers, eventId, videoId }) =>
  fetchFromApi({
    path: `/events/${eventId}/videos/${videoId}`,
    options: {
      method: 'DELETE',
      headers,
    },
  });

const useDeleteVideoFromEventMutation = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: deleteVideoFromEvent,
    ...configuration,
  });

const addAudience = async ({ headers, eventId, audienceType }) =>
  fetchFromApi({
    path: `/events/${eventId}/audience`,
    options: {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        audienceType,
      }),
    },
  });

const useAddAudienceMutation = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: addAudience,
    ...configuration,
  });

export {
  useAddAudienceMutation,
  useAddBookingInfoMutation,
  useAddContactPointMutation,
  useAddEventMainImageMutation,
  useAddEventMutation,
  useAddImageToEventMutation,
  useAddLabelMutation,
  useAddOrganizerToEventMutation,
  useAddPriceInfoMutation,
  useAddVideoToEventMutation,
  useChangeCalendarMutation,
  useChangeDescriptionMutation,
  useChangeLocationMutation,
  useChangeNameMutation,
  useChangeStatusMutation,
  useChangeStatusSubEventsMutation,
  useChangeThemeMutation,
  useChangeTypeMutation,
  useChangeTypicalAgeRangeMutation,
  useDeleteEventByIdMutation,
  useDeleteImageFromEventMutation,
  useDeleteOrganizerFromEventMutation,
  useDeleteVideoFromEventMutation,
  useGetCalendarSummaryQuery,
  useGetEventByIdQuery,
  useGetEventsByCreatorQuery,
  useGetEventsByIdsQuery,
  useGetEventsToModerateQuery,
  usePublishMutation,
  useUpdateImageFromEventMutation,
};

export type { Calendar, EventArguments };
