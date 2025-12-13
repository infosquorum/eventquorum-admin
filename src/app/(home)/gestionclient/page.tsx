// src/app/admin/gestionclient/page.tsx
import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { AdminClientListView } from 'src/sections/overview/admin/view/admin-clients-list-view';



// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Gestion des client | Admin - ${CONFIG.appName}` };

export default function Page() {
    return <AdminClientListView />;
}