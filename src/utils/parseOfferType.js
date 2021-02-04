const parseOfferType = (context) => {
  return context.toString().split('/').pop();
};

export { parseOfferType };
