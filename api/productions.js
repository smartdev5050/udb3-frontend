export const getProductions = (apiUrl, headers, fetch) => async () => {
  const res = await fetch(`${apiUrl}/productions`, {
    headers: headers(),
  });
  return await res.json();
};
