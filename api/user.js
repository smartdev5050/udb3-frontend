export const getMe = (apiUrl, headers) => async () => {
  const res = await fetch(`${apiUrl}/user`, { headers: headers() });
  return await res.json();
};

export const getPermissions = (apiUrl, headers) => async () => {
  const res = await fetch(`${apiUrl}/user/permissions/`, {
    headers: headers(),
  });
  return await res.json();
};

export const getRoles = (apiUrl, headers) => async () => {
  const res = await fetch(`${apiUrl}/user/roles/`, { headers: headers() });
  return await res.json();
};
