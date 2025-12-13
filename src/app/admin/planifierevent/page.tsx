// src/app/admin/planifierevent/page.tsx
import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { EventListView } from 'src/sections/planifierevent/event/view/event-list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Planifier evenement | Admin - ${CONFIG.appName}` };

export default function Page() {
    return <EventListView />;
}
