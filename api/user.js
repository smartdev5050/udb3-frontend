import { getHeaders } from './api';

export const getMe = (apiUrl, token) => async () => {
  const res = await fetch(`${apiUrl}/user`, {
    headers: getHeaders(token),
  });
  return await res.json();
};

export const getPermissions = (apiUrl, token) => async () => {
  const res = await fetch(`${apiUrl}/user/permissions/`, {
    headers: getHeaders(token),
  });
  return await res.json();
};

export const getRoles = (apiUrl, token) => async () => {
  const res = await fetch(`${apiUrl}/user/roles/`, {
    headers: getHeaders(token),
  });
  return await res.json();
};
