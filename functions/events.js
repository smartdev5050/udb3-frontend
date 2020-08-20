export const parseId = (eventId) => {
  return eventId.split('/').pop();
};
