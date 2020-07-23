import { fetchWithLogoutWhenFailed } from './api';

export const getMe = (apiUrl, headers) => async () => {
  const res = await fetchWithLogoutWhenFailed(`${apiUrl}/user`, {
    headers: headers(),
  });
  return await res.json();
};

export const getPermissions = (apiUrl, headers) => async () => {
  const res = await fetchWithLogoutWhenFailed(`${apiUrl}/user/permissions/`, {
    headers: headers(),
  });
  return await res.json();
};

export const getRoles = (apiUrl, headers) => async () => {
  const res = await fetchWithLogoutWhenFailed(`${apiUrl}/user/roles/`, {
    headers: headers(),
  });
  return await res.json();
};
