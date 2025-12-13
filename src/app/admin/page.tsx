import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { OverviewAdminView } from 'src/sections/overview/e-commerce/view/overview-admin-view';


// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Accueil admin - ${CONFIG.appName}` };

export default function Page() {
  return <OverviewAdminView />;
}