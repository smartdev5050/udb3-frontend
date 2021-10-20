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

const useAddEvent = (configuration = {}) =>
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

const useGetEventsToModerate = (searchQuery, configuration = {}) =>
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

const useGetEventById = ({ req, queryClient, id }, configuration = {}) =>
  useAuthenticatedQuery({
    req,
    queryClient,
    queryKey: ['events'],
    queryFn: getEventById,
    queryArguments: { id },
    enabled: !!id,
    ...configuration,
  });

const useGetEventsByIds = ({ req, queryClient, ids = [] }) => {
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

const useDeleteEventById = (configuration = {}) =>
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

const useGetEventsByCreator = (
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

const useGetCalendarSummary = (
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

const changeStatus = async ({ headers, id, type, reason }) =>
  fetchFromApi({
    path: `/events/${id.toString()}/status`,
    options: {
      method: 'PUT',
      headers,
      body: JSON.stringify({ type, reason }),
    },
  });

const useChangeStatus = (configuration) =>
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

const useChangeStatusSubEvents = (configuration = {}) =>
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

const useAddImageToEvent = (configuration = {}) =>
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

const useAddEventMainImage = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: addEventMainImage,
    ...configuration,
  });

const useUpdateImageFromEvent = (configuration = {}) =>
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

const useDeleteImageFromEvent = (configuration = {}) =>
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

const useChangeDescription = (configuration = {}) =>
  useAuthenticatedMutation({ mutationFn: changeDescription, ...configuration });

export {
  useAddEvent,
  useAddEventMainImage,
  useAddImageToEvent,
  useChangeDescription,
  useChangeStatus,
  useChangeStatusSubEvents,
  useDeleteEventById,
  useDeleteImageFromEvent,
  useGetCalendarSummary,
  useGetEventById,
  useGetEventsByCreator,
  useGetEventsByIds,
  useGetEventsToModerate,
  useUpdateImageFromEvent,
};

export type { EventArguments };
