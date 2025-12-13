import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { OrganizerCreateView } from 'src/sections/planifierevent/organisateur/view/organizer-create-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Création d'un nouvel organisateur` };

export default function Page() {
    return <OrganizerCreateView />;
}
