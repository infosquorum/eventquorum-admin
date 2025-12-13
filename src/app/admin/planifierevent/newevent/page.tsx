import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { EventCreateView } from 'src/sections/planifierevent/view/event-create-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Création d'un nouvel evenement` };

export default function Page() {
  return <EventCreateView />;
}
