const Errors = {
  UNAUTHORIZED: 'unauthorized',
};

const fetchWithRedirect = async (...args) => {
  const response = await fetch(...args);
  if (response.status === 401 || response.status === 403) {
    throw Error(Errors.UNAUTHORIZED);
  }
  return response;
};

export { fetchWithRedirect, Errors };
