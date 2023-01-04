const formatDateToISO = (date: Date) => {
  return date.toISOString().split('.')[0] + '+00:00';
};

export { formatDateToISO };
