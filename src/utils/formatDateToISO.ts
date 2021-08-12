const formatDateToISO = (date: Date) => {
  return date.toISOString().split('.')[0] + 'Z';
};

export { formatDateToISO };
