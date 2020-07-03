export const getMe = (token) => async (id) => {
  const res = await fetch(`http://io.uitdatabank.dev/users/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-Api-Key': process.env.apiKey,
    },
  });
  return await res.json();
};
