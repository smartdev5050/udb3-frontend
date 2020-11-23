const getAnnouncements = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_NEW_ANNOUNCEMENTS_URL);
  const { data: announcements } = await res.json();
  return announcements;
};

export { getAnnouncements };
