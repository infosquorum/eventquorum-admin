//src/app/admin/planifierevent/%5Bid%5D/edit/page.tsx

'use client';


import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/admin';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 IMPORTS DES SERVICES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { eventService } from 'src/lib/events/service';
import { customerService } from 'src/lib/customers/service';
import { organizerService } from 'src/lib/organizers/service';
import { eventTypesService } from 'src/lib/eventTypes/service';

import type { EventDetails } from 'src/lib/events/types';
import type { Customer } from 'src/lib/customers/types';
import type { Organizer } from 'src/lib/organizers/types';
import type { EventType } from 'src/lib/eventTypes/types';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { EventNewEditForm } from 'src/sections/planifierevent/event-new-edit-form';
import type { NewEventSchemaType } from 'src/sections/planifierevent/event-new-edit-form';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎯 COMPOSANT PRINCIPAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function EventEditPage() {
  const params = useParams();
  const eventId = params.id as string;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📦 ÉTATS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentEvent, setCurrentEvent] = useState<NewEventSchemaType | null>(null);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📖 CHARGEMENT DES DONNÉES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Charge l'événement et toutes les données liées depuis l'API
   * 
   * Workflow :
   * 1. Charger l'événement par ID
   * 2. Charger tous les clients (pour trouver le client lié)
   * 3. Charger tous les organisateurs (pour trouver les organisateurs liés)
   * 4. Charger tous les types d'événements (pour trouver le type lié)
   * 5. Résoudre les IDs en objets complets
   * 6. Mapper vers le format du formulaire
   */
  const loadEventData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔵 Chargement de l\'événement:', eventId);

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 1️⃣ CHARGER L'ÉVÉNEMENT
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      const eventDetails = await eventService.getById(eventId);

      console.log('✅ Événement chargé:', eventDetails);

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 2️⃣ CHARGER LES DONNÉES LIÉES EN PARALLÈLE
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      const [allCustomers, allOrganizers, allEventTypes] = await Promise.all([
        customerService.getAll({ pageSize: 1000 }),
        organizerService.getAll({ pageSize: 1000 }),
        eventTypesService.getAll(),
      ]);

      console.log('✅ Données liées chargées:', {
        customers: allCustomers.totalItems,
        organizers: allOrganizers.totalItems,
        types: allEventTypes.length,
      });

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 3️⃣ RÉSOUDRE LES IDs EN OBJETS COMPLETS
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      // Trouver le client
      const customer = allCustomers.items.find(c => c.id === eventDetails.customerId);
      if (!customer) {
        console.error('❌ Client introuvable. customerId:', eventDetails.customerId);
        console.error('❌ Clients disponibles:', allCustomers.items.map(c => ({ id: c.id, name: c.name })));
        throw new Error('Client introuvable');
      }
      
      console.log('✅ Client résolu:', customer.name);

      // Trouver les organisateurs
      const organizers = allOrganizers.items.filter(o => 
        eventDetails.organizerIds.includes(o.id)
      );
      if (organizers.length === 0) {
        console.error('❌ Organisateurs introuvables. organizerIds:', eventDetails.organizerIds);
        console.error('❌ Organisateurs disponibles:', allOrganizers.items.map(o => ({ id: o.id, name: `${o.firstName} ${o.lastName}` })));
        throw new Error('Organisateurs introuvables');
      }
      
      console.log('✅ Organisateurs résolus:', organizers.map(o => `${o.firstName} ${o.lastName}`));

      // Trouver le type d'événement
      // ⚠️ Le backend peut renvoyer soit eventTypeId (ID) soit eventType (label)
      // On tente les deux pour plus de robustesse
      let eventType: EventType | undefined;
      
      // Tentative 1 : Chercher par ID (si eventTypeId existe)
      if ((eventDetails as any).eventTypeId) {
        eventType = allEventTypes.find(t => t.id === (eventDetails as any).eventTypeId);
      }
      
      // Tentative 2 : Chercher par label (si eventType existe et pas trouvé par ID)
      if (!eventType && (eventDetails as any).eventType) {
        eventType = allEventTypes.find(t => t.label === (eventDetails as any).eventType);
        console.log('🔍 Type d\'événement trouvé par label:', (eventDetails as any).eventType);
      }
      
      if (!eventType) {
        console.error('❌ Type d\'événement introuvable. eventDetails:', eventDetails);
        console.error('❌ Types disponibles:', allEventTypes.map(t => ({ id: t.id, label: t.label })));
        throw new Error('Type d\'événement introuvable');
      }
      
      console.log('✅ Type d\'événement résolu:', eventType);

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 4️⃣ MAPPER VERS LE FORMAT DU FORMULAIRE
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      const formData: NewEventSchemaType = {
        id: eventDetails.id, // ✅ ID pour la mise à jour
        name: eventDetails.name,
        logo: eventDetails.image || '', // Commenté (non supporté par API)
        organizer: organizers.map(org => ({
          id: org.id,
          firstName: org.firstName,
          lastName: org.lastName,
          email: org.email,
          phoneNumber: org.phoneNumber,
        })),
        client: {
          id: customer.id,
          name: customer.name,
          type: customer.type,
          email: customer.email || '',
          phoneNumber: customer.phoneNumber || '',
        },
        type: {
          id: eventType.id,
          label: eventType.label,
        },
        description: eventDetails.description,
        available: {
          startDate: new Date(eventDetails.periodInformation.start),
          endDate: new Date(eventDetails.periodInformation.end),
        },
        location: eventDetails.location,
      };

      console.log('✅ Données mappées pour le formulaire:', formData);

      setCurrentEvent(formData);

    } catch (err) {
      console.error('❌ Erreur chargement événement:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement de l\'événement';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  // Charger les données au montage du composant
  useEffect(() => {
    if (eventId) {
      loadEventData();
    }
  }, [eventId, loadEventData]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🎨 RENDU
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Modifier un événement"
        links={[
          { 
            name: 'Planifier événement', 
            href: paths.admin.PLANIFIER_UN_EVENEMENT.root 
          },
          { name: 'Modification d\'événement' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.admin.PLANIFIER_UN_EVENEMENT.root}
            variant="contained"
            startIcon={<Iconify icon="mingcute:left-fill" />}
          >
            Retour
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ÉTAT : CHARGEMENT                                                 */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {isLoading && (
        <Box 
          display="flex" 
          flexDirection="column"
          justifyContent="center" 
          alignItems="center" 
          minHeight="400px"
          gap={2}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Chargement de l'événement...
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Récupération des données depuis le serveur
          </Typography>
        </Box>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ÉTAT : ERREUR                                                      */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {error && !isLoading && (
        <Box 
          display="flex" 
          flexDirection="column" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="400px"
          gap={2}
        >
          <Iconify 
            icon="solar:danger-circle-bold" 
            width={80} 
            color="error.main" 
          />
          <Typography variant="h6" color="error">
            {error}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Impossible de charger l'événement. Vérifiez que l'ID est correct.
          </Typography>
          <Button 
            variant="contained" 
            onClick={loadEventData}
            startIcon={<Iconify icon="solar:refresh-bold" />}
          >
            Réessayer
          </Button>
        </Box>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ÉTAT : FORMULAIRE PRÉ-REMPLI                                       */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {!isLoading && !error && currentEvent && (
        <EventNewEditForm currentEvent={currentEvent} />
      )}
    </DashboardContent>
  );
}