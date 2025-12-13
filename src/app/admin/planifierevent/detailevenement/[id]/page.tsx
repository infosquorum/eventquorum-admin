/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * PAGE DÉTAIL ÉVÉNEMENT - VERSION AVEC DIAGNOSTIC
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Cette version ajoute des logs détaillés pour diagnostiquer les problèmes
 * 
 * Route : /admin/planifierevent/detailevenement/[id]
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import type { Metadata } from 'next';

import { eventService } from 'src/lib/events/service';
import { customerService } from 'src/lib/customers/service';
import { eventTypesService } from 'src/lib/eventTypes/service';  // ← AVEC "S"

import { DetailEventView } from 'src/sections/planifierevent/detailevenement/view/detailevent-view';

import { IEventItem } from 'src/types/event';



// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎯 TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface PageProps {
  params: {
    id: string;
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📋 MÉTADONNÉES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const metadata: Metadata = {
  title: 'Détail Événement',
  description: 'Détails complets de l\'événement',
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎨 HELPERS - MAPPING STATUS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Convertit le statut backend en statut frontend
 */
function mapStatus(backendStatus: string): string {
  const statusMap: Record<string, string> = {
    NotStarted: 'non démarré',
    InProgress: 'en cours',
    Completed: 'terminé',
    Finished: 'terminé',
    Suspended: 'suspendu',
  };
  
  const mapped = statusMap[backendStatus] || backendStatus.toLowerCase();
  console.log('🎨 Mapping status:', backendStatus, '→', mapped);
  return mapped;
}

/**
 * Formate une date ISO en format français
 */
function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    const formatted = date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    console.log('📅 Format date:', isoDate, '→', formatted);
    return formatted;
  } catch (error) {
    console.error('❌ Erreur format date:', error);
    return isoDate;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎨 HELPERS - MAPPING DONNÉES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Mappe les données API vers le format attendu par la vue
 */
function mapEventToView(
  eventDetails: any,
  customer: any,
  eventType: any
): IEventItem {
  console.log('🔄 Début mapping événement...');
  
  const startDate = eventDetails.periodInformation?.start || eventDetails.startDate;
  const endDate = eventDetails.periodInformation?.end || eventDetails.endDate;
  
  const defaultAvatar = '/assets/icons/files/ic-folder.svg';
  const defaultCover = '/assets/images/cover/cover-1.webp';
  
  const mapped: IEventItem = {
    id: eventDetails.id,
    matricule: eventDetails.registrationNumber || 'N/A',
    name: eventDetails.name,
    type: eventType?.label || 'Type inconnu',
    location: eventDetails.location,
    date: `${formatDate(startDate)} - ${formatDate(endDate)}`,
    status: mapStatus(eventDetails.status),
    nomclient: customer?.name || 'Client inconnu',
    logoClient: customer?.logo || defaultAvatar,
    logo: eventDetails.image || defaultCover,
    description: eventDetails.description || '',
    coverUrl: '',
    startDate: '',
    endDate: '',
    createdAt: undefined,
    participants: 0,
    likes: 0,
    revenue: 0,
    photos: []
  };
  
  console.log('✅ Événement mappé:', mapped);
  return mapped;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎨 COMPOSANT PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default async function DetailEvenementPage({ params }: PageProps) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔵 PAGE DÉTAIL ÉVÉNEMENT - ID:', params.id);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ÉTAPE 1 : CHARGER L'ÉVÉNEMENT
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    console.log('📡 Étape 1/4 : Chargement événement...');
    let eventDetails: any;
    
    try {
      eventDetails = await eventService.getById(params.id);
      console.log('✅ Événement chargé:', {
        id: eventDetails.id,
        name: eventDetails.name,
        customerId: eventDetails.customerId,
        eventTypeId: eventDetails.eventTypeId,
        status: eventDetails.status,
      });
    } catch (error: any) {
      console.error('❌ Erreur chargement événement:', {
        message: error.message,
        status: error.status,
        url: error.url,
      });
      throw new Error(`Impossible de charger l'événement: ${error.message}`);
    }
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ÉTAPE 2 : CHARGER LE CLIENT
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    console.log('📡 Étape 2/4 : Chargement client...');
    let customer: any = null;
    
    if (eventDetails.customerId) {
      try {
        customer = await customerService.getById(eventDetails.customerId);
        console.log('✅ Client chargé:', {
          id: customer.id,
          name: customer.name,
          type: customer.type,
          hasLogo: !!customer.logo,
        });
      } catch (error: any) {
        console.warn('⚠️ Client non trouvé:', error.message);
        customer = { name: 'Client inconnu', logo: null };
      }
    } else {
      console.warn('⚠️ Aucun customerId dans l\'événement');
      customer = { name: 'Client inconnu', logo: null };
    }
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ÉTAPE 3 : CHARGER LE TYPE D'ÉVÉNEMENT
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    console.log('📡 Étape 3/4 : Chargement type événement...');
    let eventType: any = null;
    
    // Cas 1 : Le backend renvoie eventTypeId (ID)
    if (eventDetails.eventTypeId) {
      try {
        eventType = await eventTypesService.getById(eventDetails.eventTypeId);
        console.log('✅ Type chargé par ID:', {
          id: eventType.id,
          label: eventType.label,
        });
      } catch (error: any) {
        console.warn('⚠️ Type non trouvé par ID:', error.message);
        eventType = { label: 'Type inconnu' };
      }
    }
    // Cas 2 : Le backend renvoie eventType (label string)
    else if (eventDetails.eventType) {
      console.log('ℹ️ Type fourni comme label:', eventDetails.eventType);
      eventType = { label: eventDetails.eventType };
    }
    // Cas 3 : Aucune info de type
    else {
      console.warn('⚠️ Aucun eventTypeId ni eventType dans l\'événement');
      eventType = { label: 'Type inconnu' };
    }
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ÉTAPE 4 : MAPPER LES DONNÉES
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    console.log('🔄 Étape 4/4 : Mapping des données...');
    const eventForView = mapEventToView(eventDetails, customer, eventType);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ SUCCÈS : Toutes les données chargées');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // RENDU
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    return <DetailEventView event={eventForView} />;
    
  } catch (error: any) {
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // GESTION D'ERREUR GLOBALE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ ERREUR FATALE - Impossible de charger la page');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    
    return (
      <div style={{
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'system-ui',
      }}>
        <div style={{
          background: '#fee',
          border: '2px solid #c33',
          borderRadius: '8px',
          padding: '1.5rem',
        }}>
          <h1 style={{ color: '#c33', marginTop: 0 }}>
            ❌ Erreur de Chargement
          </h1>
          <p style={{ fontSize: '1.1rem', margin: '1rem 0' }}>
            Impossible de charger les détails de l'événement.
          </p>
          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Détails Techniques
            </summary>
            <pre style={{
              background: '#fff',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '0.9rem',
            }}>
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#ffe',
            border: '1px solid #cc9',
            borderRadius: '4px',
          }}>
            <h3 style={{ marginTop: 0 }}>🔍 Vérifications à Faire</h3>
            <ul>
              <li>Le backend .NET est-il démarré ?</li>
              <li>Les services existent-ils dans src/lib/... ?</li>
              <li>Ouvrez F12 → Console pour voir les logs détaillés</li>
              <li>Ouvrez F12 → Network pour voir les requêtes API</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}