import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { customerService } from 'src/lib/customers/service';
import type { CustomerDetails } from 'src/lib/customers/types';
import type { IClientItem } from 'src/types/client';

import { FicheClientView } from 'src/sections/gestionclient/ficheclient/view/ficheclient-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Fiche client` };

type Props = {
  params: { id: string };
};

/**
 * Utilise CustomerDetails (getById) avec TOUS les champs disponibles
 */
function convertCustomerDetailsToClientItem(customer: CustomerDetails): IClientItem {
  const isPhysical = customer.type === 'Physical';
  const isLegal = customer.type === 'Legal';

  return {
    id: customer.id,

    company_name: customer.name,

    email: customer.email || '',

    phoneNumber: customer.phoneNumber || '',

    creationDate: customer.createdAt
      ? new Date(customer.createdAt).toLocaleDateString('fr-FR')
      : '',

    eventNumber: 0,

    logo: customer.image || '/assets/icons/files/ic-folder.svg',
    personLogo: customer.image || '/assets/icons/files/ic-folder.svg',

    isMoralePerson: isLegal,

    address: customer.address || '',

    contact_name: isPhysical
      ? (customer.lastName || '')
      : (customer.contactLastName || ''),

    contact_firstname: isPhysical
      ? (customer.firstName || '')
      : (customer.contactFirstName || ''),

    num_identification: customer.companyIdentificationNumber || '',
  };
}

export default async function Page({ params }: Props) {
  const { id } = params;

  try {
    // ✅ Récupérer le customer détaillé depuis l'API
    const customer = await customerService.getById(id);

    // ✅ Convertir au format UI avec le BON convertisseur
    const currentClient = convertCustomerDetailsToClientItem(customer);

    return <FicheClientView client={currentClient} />;
  } catch (error) {
    console.error('Erreur chargement customer:', error);
    notFound();
  }
}

// ----------------------------------------------------------------------

export const dynamic = 'force-dynamic';