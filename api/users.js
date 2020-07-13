export const getMe = async (token) => {
  const res = await fetch(`${process.env.apiUrl}/user`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-Api-Key': process.env.apiKey,
    },
  });
  return await res.json();
};
