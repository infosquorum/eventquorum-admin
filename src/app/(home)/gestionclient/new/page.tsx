// src/app/admin/gestionclient/new/page.tsx
import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { ClientCreateView } from 'src/sections/client/view/client-create-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Create a new user | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ClientCreateView />;
}
