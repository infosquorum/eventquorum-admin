// app/admin/planifier-evenement/organisateur/[id]/page.tsx

import { OrganizerDetailsView } from 'src/sections/planifierevent/organisateur/organizer-details-view';


// ----------------------------------------------------------------------

/**
 * Métadonnées de la page
 */
export const metadata = {
    title: 'Détails de l\'organisateur | EventQuorum',
};

// ----------------------------------------------------------------------

type Props = {
    params: {
        id: string;
    };
};

/**
 * Page de détails d'un organisateur
 * 
 * Route : /admin/planifierevent/organisateur/[id]
 * 
 * Exemple : /admin/planifierevent/organisateur/123e4567-e89b-12d3-a456-426614174000
 */
export default function Page({ params }: Props) {
    const { id } = params;

     
    return <OrganizerDetailsView id={id} />;
}