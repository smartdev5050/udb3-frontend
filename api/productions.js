export const findProductions = (apiUrl, headers, fetch) => async (
  name = '',
  start = 0,
  limit = 10,
) => {
  const url = new URL(`${apiUrl}/productions/`);
  url.search = new URLSearchParams({
    name,
    start,
    limit,
  }).toString();
  const res = await fetch(url, {
    headers: headers(),
  });
  return await res.json();
};
