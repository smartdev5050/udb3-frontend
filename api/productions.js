export const findProductions = (apiUrl, headers, fetch) => async (
  name = '',
  offset = 0,
  limit = 10,
) => {
  const url = new URL(`${apiUrl}/productions/`);
  url.search = new URLSearchParams({
    name,
    offset,
    limit,
  }).toString();
  const res = await fetch(url, {
    headers: headers(),
  });
  return await res.json();
};
