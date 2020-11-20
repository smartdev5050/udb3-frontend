const getAnnouncements = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_NEW_ANNOUNCEMENTS_URL);
  return await res.json();
};

export { getAnnouncements };
