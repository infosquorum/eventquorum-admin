import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { _eventList } from 'src/_mock/_events';
import { PhotothequeListView } from 'src/sections/phototheque/view/phototheque-home-list-view';

// Move data fetching to a utility function (not exported)
const fetchEvents = async () => {
  return {
    events: _eventList,
    error: null,
  };
};

export const metadata: Metadata = {
  title: `Photothèque | Admin - ${CONFIG.appName}`
};

export default async function PhotothequePage() {
  const { events, error } = await fetchEvents();

  if (error) {
    return (
      <div>
        Error loading events: {error}
      </div>
    );
  }

  return <PhotothequeListView events={events} />;
}