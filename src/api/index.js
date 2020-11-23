import { useQuery } from 'react-query';
import { getAnnouncements } from './announcements';

const useAnnouncements = () => useQuery('announcements', getAnnouncements);

export { useAnnouncements };
