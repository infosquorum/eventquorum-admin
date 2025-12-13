// src/app/admin/gestionclient/[id]/edit/page.tsx

import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { customerService } from 'src/lib/customers/service'; // ✅ Import du service

import { ClientEditView } from 'src/sections/client/view/client-edit-view';


// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Modifier client | Dashboard - ${CONFIG.appName}`
};

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  // Charger le client depuis l'API
  let customer = null;

  try {
    customer = await customerService.getById(id);
  } catch (error) {
    console.error('Erreur chargement client:', error);
    // customer reste null, la vue gérera l'erreur
  }

  return <ClientEditView customer={customer} />;
}

// ----------------------------------------------------------------------

/**
 * [1] Default - Force dynamic car on charge depuis l'API
 */
export const dynamic = 'force-dynamic';