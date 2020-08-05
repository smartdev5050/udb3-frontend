export const findProductions = (apiUrl, headers, fetch) => async (
  name = '',
) => {
  const url = `${apiUrl}/productions/?name=${name}`;
  const res = await fetch(url, {
    headers: headers(),
  });
  return await res.json();
};
